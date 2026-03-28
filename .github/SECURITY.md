# Security Policy

## Supported Versions

| Version  | Supported       |
| -------- | --------------- |
| latest   | ✅ Yes          |
| < latest | ❌ No (upgrade) |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, use GitHub's private
[Security Advisories](https://github.com/YOUR_USERNAME/fresh-normalize/security/advisories/new) to
report vulnerabilities confidentially.

We will respond within 48 hours and work with you to resolve the issue before any public disclosure.

## Scope

`fresh-normalize` is a plain CSS library with no JavaScript, no network requests, and no user data
processing. Security concerns are most likely limited to:

- Supply chain attacks (malicious npm package versions)
- CSS injection vulnerabilities (if the library is misused in a server-rendered context)

For supply chain security, we use npm provenance and SLSA attestations on all releases.
