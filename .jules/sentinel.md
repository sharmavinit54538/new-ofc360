## 2023-10-25 - [Information Exposure via Exception Handler]
**Vulnerability:** Global exception handler returning `str(exc)` in HTTP response.
**Learning:** Returning raw exception strings directly to the client can leak sensitive application state, stack details, or database structure.
**Prevention:** Catch unhandled exceptions globally and return a generic "An internal server error occurred" response, while logging the actual exception details securely on the server side.
