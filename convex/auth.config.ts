// Tells Convex to trust JWTs minted by Clerk.
//
// Setup (one-time):
//   1. Clerk dashboard → JWT Templates → template named "convex" (default RS256
//      signing key), Issuer = your Frontend API URL. Its Claims MUST include
//      `{ "aud": "convex" }` — Convex requires `applicationID` (a domain-only
//      provider is rejected), so the token must carry a matching `aud`.
//   2. Set the issuer in the Convex deployment env (NOT .env.local):
//        npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-app>.clerk.accounts.dev
//   `applicationID` must equal the template's `aud` claim ("convex").
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
};
