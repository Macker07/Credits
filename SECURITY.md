# Security

Credits stores nutrition and body data in browser storage. Do not deploy modified builds that transmit this data without updating the privacy notice and obtaining appropriate consent.

## Supported release

Only the latest commit on `main` is supported. Run `npm audit --omit=dev`, tests, lint, and a production build before deployment.

## Reporting

Report vulnerabilities privately to the repository owner. Include reproduction steps and avoid including real health data.

## Deployment requirements

- Serve the application over HTTPS.
- Preserve the security headers configured in `next.config.ts`.
- Apply rate limiting at the hosting edge in addition to the process-local food-search limit.
- Never add API secrets under a `NEXT_PUBLIC_` environment variable.
- Review and update the privacy policy before adding accounts, analytics, AI, or health integrations.
