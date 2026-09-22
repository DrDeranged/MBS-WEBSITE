import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(projectDir, "dist", "public");

function extractArray(source, name) {
  const declaration = `const ${name} =`;
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex === -1) {
    throw new Error(`Could not find ${declaration}.`);
  }

  const start = source.indexOf("[", declarationIndex + declaration.length);
  if (start === -1) {
    throw new Error(`Could not find the ${name} array.`);
  }

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "[") {
      depth += 1;
    } else if (character === "]") {
      depth -= 1;
      if (depth === 0) {
        const literal = source.slice(start, index + 1);
        return Function(`"use strict"; return (${literal});`)();
      }
    }
  }

  throw new Error(`Could not parse the ${name} array.`);
}

function extractLastUpdated(source) {
  const match = source.match(/Last updated: ([A-Z][a-z]+ \d{1,2}, \d{4})/);
  if (!match) {
    throw new Error("Could not find the last-updated date.");
  }
  return match[1];
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderParagraphs(body, textSize = "text-base") {
  return body
    .split("\n\n")
    .map(
      (paragraph) =>
        `<p class="text-muted-foreground leading-relaxed ${textSize}">${paragraph
          .split("\n")
          .map(escapeHtml)
          .join("<br />")}</p>`,
    )
    .join("");
}

function renderHeader(title, updated) {
  return `<section class="pt-28 pb-16 md:pt-36 md:pb-20" style="background:linear-gradient(160deg,#0E2A47 0%,#1F4E79 100%)"><div class="mx-auto max-w-3xl px-6"><h1 class="font-heading font-bold text-4xl md:text-5xl text-white mb-4">${escapeHtml(title)}</h1><p class="text-base" style="color:rgba(255,255,255,0.55)">My Business Solutions (MBS) &bull; Last updated: ${escapeHtml(updated)}</p></div></section>`;
}

function renderPrivacyPage(sections, updated) {
  const content = sections
    .map((section) => {
      const heading = section.heading
        ? `<h2 class="font-heading font-semibold text-xl md:text-2xl text-foreground mb-4">${escapeHtml(section.heading)}</h2>`
        : "";
      return `<section>${heading}<div class="space-y-3">${renderParagraphs(section.body)}</div></section>`;
    })
    .join("");

  return `<main data-prerendered-legal-page="privacy-policy">${renderHeader("Privacy Policy", updated)}<section class="py-16 md:py-24 bg-background"><div class="mx-auto max-w-3xl px-6"><div class="space-y-10">${content}</div></div></section></main>`;
}

function renderTermsPage(intro, sections, updated) {
  const introHtml = intro
    .map(
      (paragraph) =>
        `<p class="text-muted-foreground leading-relaxed text-sm">${escapeHtml(paragraph)}</p>`,
    )
    .join("");
  const content = sections
    .map((section) => {
      const privacyLink =
        section.heading === "SMS Terms"
          ? '<p class="text-muted-foreground leading-relaxed text-sm">See our <a href="/privacy-policy">Privacy Policy</a>.</p>'
          : "";
      return `<section class="border-t pt-8" style="border-color:#DCE4EC"><h2 class="font-heading font-semibold text-lg md:text-xl text-foreground mb-4">${escapeHtml(section.heading)}</h2><div class="space-y-3">${renderParagraphs(section.body, "text-sm")}${privacyLink}</div></section>`;
    })
    .join("");

  return `<main data-prerendered-legal-page="terms-of-service">${renderHeader("Terms of Service", updated)}<section class="py-16 md:py-24 bg-background"><div class="mx-auto max-w-3xl px-6"><div class="space-y-4 mb-12">${introHtml}</div><div class="space-y-10">${content}</div></div></section></main>`;
}

function renderSmsOptInPage() {
  const consentText =
    "I agree to receive text messages from My Business Solutions LLC about my application (application received, documents needed, status updates). Message frequency varies. Message and data rates may apply. Reply STOP to cancel, HELP for help. See our Privacy Policy and Terms of Service.";

  return `<main data-prerendered-legal-page="sms-opt-in"><section class="pt-28 pb-16 md:pt-36 md:pb-20" style="background:linear-gradient(160deg,#0E2A47 0%,#1F4E79 100%)"><div class="mx-auto max-w-3xl px-6"><h1 class="font-heading font-bold text-4xl md:text-5xl text-white">SMS Opt-In — My Business Solutions LLC</h1></div></section><section class="py-16 md:py-24 bg-background"><div class="mx-auto max-w-3xl px-6"><div class="space-y-8"><p class="text-muted-foreground leading-relaxed text-base">Business owners opt in to text messages by checking the box below on our online financing application at <a href="https://app.my-business-solutions.com/apply">https://app.my-business-solutions.com/apply</a>.</p><img src="/sms-opt-in.png" alt="SMS consent checkbox on the MBS financing application" class="w-full rounded-2xl border border-border shadow-sm" /><blockquote class="rounded-xl border border-border bg-muted/40 p-6 text-foreground leading-relaxed">“${escapeHtml(consentText)}”</blockquote><div class="space-y-3 text-muted-foreground leading-relaxed text-base"><p>The box is unchecked by default and is separate from the credit authorization.</p><p>Consent is recorded with a timestamp and IP address. No messages are sent to anyone who has not checked the box.</p></div><div class="flex flex-wrap gap-x-6 gap-y-3"><a href="https://my-business-solutions.com/privacy-policy">Privacy Policy</a><a href="https://my-business-solutions.com/terms-of-service">Terms of Service</a></div></div></div></section></main>`;
}

function applyMetadata(template, route, title, description) {
  const canonicalUrl = `https://my-business-solutions.com/${route}`;
  return template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    )
    .replace(
      /<meta name="twitter:url" content="[^"]*" \/>/,
      `<meta name="twitter:url" content="${canonicalUrl}" />`,
    );
}

async function writePage(template, route, body, metadata) {
  const outputPath = join(distDir, route, "index.html");
  const pageTemplate = applyMetadata(
    template,
    route,
    metadata.title,
    metadata.description,
  );
  const html = pageTemplate.replace(
    '<div id="root"></div>',
    `<div id="root">${body}</div>`,
  );
  if (html === pageTemplate) {
    throw new Error(`Could not inject prerendered HTML for ${route}.`);
  }
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

const [template, privacySource, termsSource] = await Promise.all([
  readFile(join(distDir, "index.html"), "utf8"),
  readFile(join(projectDir, "src", "pages", "privacy-policy.tsx"), "utf8"),
  readFile(join(projectDir, "src", "pages", "terms-of-service.tsx"), "utf8"),
]);

const privacySections = extractArray(privacySource, "SECTIONS");
const termsIntro = extractArray(termsSource, "INTRO");
const termsSections = extractArray(termsSource, "SECTIONS");

await Promise.all([
  writePage(
    template,
    "privacy-policy",
    renderPrivacyPage(privacySections, extractLastUpdated(privacySource)),
    {
      title: "Privacy Policy | My Business Solutions",
      description:
        "My Business Solutions privacy policy — how we collect, use, and protect your personal information.",
    },
  ),
  writePage(
    template,
    "terms-of-service",
    renderTermsPage(
      termsIntro,
      termsSections,
      extractLastUpdated(termsSource),
    ),
    {
      title: "Terms of Service | My Business Solutions",
      description:
        "Read the My Business Solutions Terms of Service governing your use of our website and services.",
    },
  ),
  writePage(
    template,
    "sms-opt-in",
    renderSmsOptInPage(),
    {
      title: "SMS Opt-In | My Business Solutions",
      description:
        "Evidence of the SMS consent process used by My Business Solutions LLC.",
    },
  ),
]);

console.log("Prerendered /privacy-policy, /terms-of-service, and /sms-opt-in.");