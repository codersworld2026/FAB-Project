-- ============================================================================
-- FAB Project — 0004: profiles privilege-escalation guard (Phase 0 Security Gate)
--
-- FORWARD-ONLY migration. Do NOT edit migrations 0001–0003.
--
-- PROBLEM
--   0001's `profiles_update_own` policy is `for update using (auth.uid() = id)`
--   with NO `with check` and NO column protection. An authenticated user can
--   therefore run `update profiles set role = 'owner' where id = auth.uid()`
--   directly through the Supabase client and self-promote to owner/admin.
--   (No application flow updates profiles today — the only profile write is the
--   `handle_new_user` INSERT trigger — so tightening this breaks nothing.)
--
-- FIX
--   1. Re-create the own-row UPDATE policy WITH CHECK so a user can only ever
--      write their own row (cannot reassign row ownership).
--   2. Add a BEFORE UPDATE trigger that blocks changes to PROTECTED fields
--      (role, id, email) unless the actor is privileged. RLS cannot compare OLD
--      vs NEW, so this must be a trigger.
--
--   Safe fields (full_name, school) remain freely updatable by the row owner.
--   Role is NEVER trusted from the browser — it is governed here.
--
-- DEPLOYMENT
--   Test in an isolated dev/local Supabase first. Do NOT apply to production
--   automatically — requires explicit product-owner approval (`supabase db push`).
-- ============================================================================

-- 1. Own-row update policy, now WITH CHECK -----------------------------------
-- Keeps the original self-only row scope (owners manage other users via the
-- service role, not via this policy) and adds a write-check so the new row must
-- still belong to the caller.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. Protected-field guard trigger -------------------------------------------
create or replace function public.guard_profile_protected_fields()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Only scrutinise updates that touch protected fields.
  if new.role  is distinct from old.role
     or new.id    is distinct from old.id
     or new.email is distinct from old.email then
    -- Allow privileged actors ONLY:
    --   * owners                  → future admin role-management
    --   * the service role        → admin client / webhooks
    --   * sessions with no JWT uid → SQL editor / migrations as postgres (recovery)
    if not (
      public.is_owner()
      or auth.role() = 'service_role'
      or auth.uid() is null
    ) then
      raise exception
        'profiles: changing protected fields (role, id, email) is not permitted'
        using errcode = '42501'; -- insufficient_privilege
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_protected_fields on public.profiles;
create trigger profiles_guard_protected_fields
  before update on public.profiles
  for each row
  execute function public.guard_profile_protected_fields();

-- ----------------------------------------------------------------------------
-- ROLLBACK / RECOVERY
--   Forward-only. To revert, ship a follow-up migration:
--     drop trigger   if exists profiles_guard_protected_fields on public.profiles;
--     drop function  if exists public.guard_profile_protected_fields();
--     -- and, if desired, restore the original (insecure) policy.
--   Owners are NEVER locked out: roles can still be set via the service-role
--   admin client, or via the Supabase SQL editor (runs as postgres, auth.uid()
--   IS NULL, which the trigger permits above).
-- ----------------------------------------------------------------------------
