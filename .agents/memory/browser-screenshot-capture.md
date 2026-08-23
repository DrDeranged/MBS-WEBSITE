---
name: Browser screenshot capture
description: Reliable full-page and section screenshot workflow for viewport-sensitive MBS pages.
---

Use a normal browser viewport with Chrome DevTools Protocol `Page.captureScreenshot` for full-page or section captures. Do not try to simulate a full-page screenshot by making the preview viewport extremely tall.

**Why:** The MBS homepage uses viewport-height hero layouts. An oversized preview viewport makes `100vh` sections grow to the screenshot height, so the capture can show only the hero and hide the intended downstream section. The preview utility also does not reliably apply initial fragment scrolling in this SPA.

**How to apply:** Capture at the requested width with a normal viewport height, enable reduced motion when a stable final state is needed, and use CDP's `captureBeyondViewport` (optionally clipped to the section's page coordinates). Save both focused section and full-page images under `docs/screens/` when a task requires visual evidence.