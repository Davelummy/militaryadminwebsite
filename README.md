# MilitaryAdmin.org

MilitaryAdmin.org is a prototype web portal for U.S. military families and trusted contacts
to request verified communication access to active-duty service members.

## Purpose

This project demonstrates the front-end user experience for identity verification and access
requests. It emphasizes official U.S. government visual standards, accessibility, and secure
handling of sensitive data.

## Tech stack

- Next.js (App Router) with TypeScript
- USWDS 3 (U.S. Web Design System)
- Sass (SCSS)

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment variables

Copy `.env.example` to `.env.local` and set:
- `IDENTITY_VERIFICATION_API_BASE_URL` for the future DoD verification API.
- `ENCRYPTION_KEY` for prototype encryption (replace with KMS/HSM in production).

## Important security note

This repo is a front-end prototype. It does not implement real authentication, storage, or
encryption. All sensitive flows must be integrated with an approved, secure backend before
production use.

## Data handling policy

- Third-party form handlers (Formcarry, Formspree, Zapier, email) are prohibited for sensitive data.
- SSN, DOB, and ID document content are never logged or returned in API responses.
- Sensitive fields are encrypted at rest using `ENCRYPTION_KEY` (prototype only).
- Replace encryption with KMS/HSM-managed keys before production.
- The identity verification integration is stubbed and must be replaced with the approved DoD
  verification endpoint using secure networking and mutual TLS.
