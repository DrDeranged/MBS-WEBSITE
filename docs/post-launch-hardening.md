# Post-launch hardening audit

Live verification target: `https://my-business-solutions.com`

## W1 — Mobile motion

| Element | Before | After | Evidence |
| --- | --- | --- | --- |
| Hero video | Imperative autoplay had a one-shot retry without cleanup and continued in hidden tabs. | Shared autoplay handling adds declarative autoplay, iOS-safe muted playback, retry cleanup, poster fallback, tab pause/resume, and reduced-motion pause. | 390px iOS Safari and Android Chrome emulation: video playing inline, current time advancing, zero overflow, no console errors. |
| Match panel | Started its interval before confirmed visibility and kept timers active in background tabs. | Rotation begins only while intersecting and page-visible; all cycle and animation timers are cleared on hide/unmount and reset on return. | Timer lifecycle inspected after implementation; TypeScript clean. |
| Industry marquee | Visual track was fully hidden from assistive technology. | Transform-only duplicated animation remains; a static screen-reader list exposes the industries. | Computed animation uses `mbs-marquee` with a changing transform matrix. |
| Reveal entrances | Reduced-motion preference was sampled once; missing IntersectionObserver could leave content hidden. | Uses the reactive reduced-motion hook and immediately reveals content when IntersectionObserver is unavailable. | Reduced-motion emulation: no Reveal opacity transitions and no Reveal content hidden. |
| Calculator/count-up | Pulse timeout and count-up RAF could survive unmount/value changes. | RAF and timeout cleanup added; reduced motion skips calculator pulse/key updates. | TypeScript clean; reduced-motion behavior static. |

## W2 — Live-domain correctness

| Check | Result | Evidence |
| --- | --- | --- |
| Apex HTTPS | PASS | `https://my-business-solutions.com/` returns 200. |
| `www` HTTPS | FAIL — external configuration | `https://www.my-business-solutions.com/` fails TLS. Replit reports only the generated URL as an additional domain; `www` is not registered separately. |
| Custom-domain leakage | PASS | Rendered HTML, canonical, `og:url`, robots, and sitemap contain no `mbs-assets.replit.app`. |
| Route metadata | PASS | All public routes return route-specific custom-domain canonical and Open Graph URLs. |
| Redirects | PASS | All 23 configured legacy paths return HTTP 301 with the intended Location. |
| Branded 404 | PASS | Unknown route returns HTTP 404, branded page shell, and `noindex, follow`. |
| Favicon/social image | PASS | `/favicon.svg` and `/og.png` return 200 with correct content types. |
| Browser console | PASS | Eleven-route 390px live sweep reports no errors, no overflow, and no generated-domain leakage. |

### Required `www` action

In Replit Publishing, add `www.my-business-solutions.com` as a separate custom domain. Replit will provide its own A and TXT records. Add those exact records in GoDaddy, retain the TXT record for SSL renewal, then complete Replit verification. Do not reuse or guess the apex values.

## W3 — Forms and integrations

| Check | Result | Evidence |
| --- | --- | --- |
| Contact → CRM | PASS | One non-personal submission labeled `LAUNCH-TEST — DELETE` returned HTTP 200 with `success: true` and a lead receipt. It requires manual CRM deletion. |
| Contact failure safety | PASS after fix | Submission now has a 15-second timeout, no blind retry, and requires the documented success response instead of accepting any 2xx. |
| Apply CTA attribution | PASS | Live calculator and representative destination checks preserve `src`; a representative `type` query is also preserved by the destination. |
| Calculator handoff | PARTIAL | Live URL preserves `amount=75000`, `term=12`, and `freq=Monthly`. The external application starts with financing type and exposes no prefill fields on step 1, so visible field prefill requires later-step/manual confirmation. |
| MbsAssist stream | PASS | One short live request returned SSE content events, `X-Accel-Buffering: no`, and a final done event. |
| MbsAssist validation | PASS after fix | Invalid, null, and oversized conversations return 400 before rate-limit/model use; request body is capped at 32 KB and unapproved origins return 403. |
| MbsAssist limiter | PASS | Dependency-free local test allowed requests 1–10 and rejected request 11 without invoking the model. |
| Application status | PASS | `/apply/status` returns 200 without redirect. |

## W4 — Lighthouse performance

Baseline Lighthouse 13.4.1, run against the custom live domain:

| Route | Profile | Performance | Accessibility | Best Practices | SEO |
| --- | --- | ---: | ---: | ---: | ---: |
| Home | Mobile | 55 | 100 | 100 | 100 |
| Home | Desktop | 94 | 100 | 100 | 100 |
| Calculator | Mobile | 66 | 100 | 100 | 100 |
| Calculator | Desktop | 98 | 100 | 100 | 100 |

Mobile performance missed the 85 target. The largest standard opportunity was unused startup JavaScript. Unused eager React Query, Tooltip, and Toaster providers were removed; cosmetic eager Framer Motion usage was replaced with native reduced-motion handling and CSS while the full assistant panel remains lazy. The production entry bundle decreased from about 482 KB to 230 KB. Final live scores must be recorded after the single post-workstream publish.