/**
 * True once the Clerk + Convex backend keys are present.
 *
 * Preview mode keys off this: before the backend is configured the protected
 * pages render demo data; once the keys exist, real Clerk auth + Convex data
 * take over. (This replaced the old Supabase-configured check during the
 * migration off Supabase.)
 */
export function isBackendConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    Boolean(process.env.NEXT_PUBLIC_CONVEX_URL)
  );
}
