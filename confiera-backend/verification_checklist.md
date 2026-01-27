# Verification Checklist for Auth & RBAC

Use this checklist to verify the implementation.

## 1. Backend Setup
- [ ] Database migrated (`npx prisma db push` or `migrate dev`)
- [ ] Server running (`npm run start:dev` in backend)
- [ ] `.env` file configured with Database URL and JWT Secrets

## 2. Authentication Flows (Frontend + Backend)
- [ ] **Signup**: 
    - [ ] Create a new account via `/register`
    - [ ] Verify success toast and redirection to login
    - [ ] Check Database: User created with `PENDING_VERIFICATION` status
    - [ ] Check Console (Backend): Verification Link logged
- [ ] **Email Verification**:
    - [ ] Click the link in backend console (`/verify-email?token=...`)
    - [ ] Verify success page on frontend
    - [ ] Check Database: User status `ACTIVE`, `emailVerifiedAt` set
- [ ] **Login**:
    - [ ] Login with verified credentials
    - [ ] Verify redirection to Home/Dashboard
    - [ ] Check Network: `POST /auth/login` returns Access Token
    - [ ] Check Network: `refresh_token` cookie set (HttpOnly)
- [ ] **Persistence**:
    - [ ] Reload page. User should remain logged in (via `checkAuth` / refresh)
- [ ] **Logout**:
    - [ ] Click Logout (if implemented in Dashboard UI) or call invalidation
    - [ ] Verify `refresh_token` cookie cleared
- [ ] **Forgot Password**:
    - [ ] Request reset via `/login` -> Forgot Password
    - [ ] Check Console for Reset Link
    - [ ] Use link to reset password
    - [ ] Login with new password (Old password should fail)

## 3. RBAC (Postman / Backend Testing)
- [ ] **Protected Routes**:
    - [ ] Try to access `POST /admin/some-action` (create a dummy one if needed) with Participant User
    - [ ] Verify `403 Forbidden`
- [ ] **Role Assignment**:
    - [ ] Manually assign 'Admin' role in DB to a user
    - [ ] Login again (to refresh token with new claims)
    - [ ] Access Admin route -> Success

## 4. Security Checks
- [ ] **Token Storage**:
    - [ ] Verify Access Token is NOT in LocalStorage (it's in Memory/State)
    - [ ] Verify Refresh Token is in Cookie (HttpOnly)
- [ ] **Enumeration**:
    - [ ] Try detailed `forgot-password` with non-existent email. Message should be generic.
