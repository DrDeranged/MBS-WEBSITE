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
]);

console.log("Prerendered /privacy-policy and /terms-of-service.");