# Security Policy

## Vulnerability Disclosure

If you discover a security vulnerability, please report it by opening a GitHub Issue with the label `security`. For sensitive vulnerabilities, use GitHub's private vulnerability reporting feature.

**Do not** disclose vulnerabilities publicly until they have been addressed.

## Threat Model

| Threat | Vector | Mitigation |
|--------|--------|-----------|
| XSS / DOM Injection | User-controlled content rendered to DOM | No `dangerouslySetInnerHTML` used; all content rendered as React text nodes |
| Prototype Pollution | Malicious JSON deserialization | `Object.create(null)` used for plain data objects; JSON data is static |
| Malicious localStorage Data | Tampered progress data in localStorage | Only string IDs stored; parsed with type guards; errors caught silently |
| Supply Chain Attacks | Compromised npm packages | All dependency versions pinned exactly (no `^` or `~`); npm audit in CI |
| CSP Bypass | Inline scripts or external resources | CSP meta tag restricts to `'self'` with minimal exceptions |

## Architecture Notes

This is a **frontend-only** application with no backend, no authentication, and no user-generated content sent to a server. Data flow:

- Grammar lessons are static JSON bundled at build time
- Progress is persisted to `localStorage` (key: `nihongemu_progress`) as an array of exercise ID strings
- No network requests are made at runtime

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | ✅        |

## Security Checklist

- ✅ No `dangerouslySetInnerHTML` used anywhere
- ✅ All dependency versions pinned
- ✅ CSP meta tag in place
- ✅ `Object.create(null)` for prototype-safe objects
- ✅ localStorage data validated with type guards
- ✅ npm audit run in CI
- ✅ CodeQL scanning enabled