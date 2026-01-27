# SECURITY.md - Confiera Authentication Architecture

## 1. Authentication Strategy

We use a **Refresh Token Rotation** strategy with JWTs to balance security and user experience.

-   **Access Token**: Short-lived (15 minutes). Sent in the JSON body, stored in memory (React State / Context) on the client. It is attached to `Authorization: Bearer <token>` headers for API requests.
-   **Refresh Token**: Long-lived (7 days). Stored in an **httpOnly, Secure, SameSite=Strict** cookie. This prevents XSS attacks from stealing the refresh token.

### Why not LocalStorage?
Storing tokens in `localStorage` makes them accessible to any JavaScript running on the page (XSS vulnerability). By using an `httpOnly` cookie for the refresh token, even if an attacker injects a script, they cannot read the refresh token to persist a session.

## 2. Password Hashing
We use **Argon2id** (via the `argon2` library). 
-   **Why?** Argon2 is the winner of the Password Hashing Competition. It is memory-hard, making it resistant to GPU/ASIC brute-force attacks compared to bcrypt (which is CPU-hard but GPU-friendly).
-   **Configuration**: Defaults are used, which are generally secure (providing salts automatically).

## 3. Threat Mitigation

### Token Enumeration / Account Scraping
-   Endpoints like `forgot-password` always return a generic "If that email exists..." message. This prevents attackers from checking if a specific email is registered.

### Refresh Token Theft (Reuse Detection)
-   If a refresh token is leaked and used by an attacker, the legitimate user eventually tries to use their (now old) refresh token.
-   The server detects that an *old* refresh token was used.
-   **Action**: The server immediately revokes the **entire session** family, logging out both the attacker and the victim, forcing re-authentication.

### Session Invalidation
-   On **Password Reset**: All active sessions for the user are revoked.
-   On **Logout**: Currently active session is revoked.

## 4. Role-Based Access Control (RBAC)

We use NestJS Guards (`RolesGuard`) combined with a custom decorator `@Auth('RoleName')`.
-   **Mechanism**: The `JwtStrategy` extracts the user's role from the Access Token payload.
-   **Enforcement**: The guard checks if the user's role matches the required roles for the endpoint.
-   **Safety**: If a user's role changes, they must re-authenticate or refresh their token to get the new permissions (since roles are baked into the signed JWT).

## 5. Rate Limiting (Recommended)
While not fully implemented in this MVP, we recommend adding `@nestjs/throttler` to:
-   `POST /auth/login`: Limit to 5 attempts per minute per IP.
-   `POST /auth/signup`: Limit to 3 per hour per IP.
-   `POST /auth/forgot-password`: Limit to 3 per hour.

## 6. Email Verification
-   Users are created in a `PENDING_VERIFICATION` state.
-   A random 32-byte hex token is generated and hashed (SHA-256) before storage in the database.
-   The raw token is emailed. If the DB is compromised, the attacker only sees the hash and cannot construct the verification link.

## 7. Secrets Management
-   All secrets are loaded from `.env` via `@nestjs/config`.
-   `PrismaService` connects via `DATABASE_URL`.
