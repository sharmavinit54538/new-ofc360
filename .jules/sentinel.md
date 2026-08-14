## 2024-05-18 - [Fix Hardcoded QR Verification Salt Secret]
**Vulnerability:** A hardcoded secret string (`OFC360_SALT_SECRET`) was used as part of the seed to generate dynamic QR token values for attendance verification in `src/utils/verification/qrVerification.ts`.
**Learning:** Hardcoded cryptographic secrets can easily be extracted by anyone with access to the source code, leading to bypasses in authentication or verification systems like the QR scanning module here.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_SECRET`) with secure fallback mechanisms in development and production to manage sensitive strings, rather than embedding them directly in source files.
