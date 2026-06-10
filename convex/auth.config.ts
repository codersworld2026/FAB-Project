// Tells Convex to trust JWTs minted by Clerk.
//
// Setup (one-time, in the Clerk + Convex dashboards):
//   1. Clerk dashboard → JWT Templates → create a template named "convex"
//      (Clerk ships a Convex preset). Its issuer URL is the value below.
//   2. Set the issuer in the Convex deployment env, NOT in .env.local:
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
