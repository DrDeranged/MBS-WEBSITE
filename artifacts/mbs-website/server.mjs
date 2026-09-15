import {
  createReadStream,
  existsSync,
  readFileSync,
  statSync,
} from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = fileURLToPath(new URL("./dist/public/", import.meta.url));
const indexPath = join(publicDir, "index.html");
const indexHtml = readFileSync(indexPath, "utf8");
const port = Number(process.env.PORT);
const siteUrl = "https://my-business-solutions.com";

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a positive integer.");
}

const applyRedirect =
  "https://app.my-business-solutions.com/apply?src=get-started-redirect";

const redirects = new Map([
  ["/get-started", applyRedirect],
  ["/get-started/", applyRedirect],
  ["/about/", "/about"],
  ["/products/", "/products"],
  ["/calculator/", "/calculator"],
  ["/contact/", "/contact"],
  ["/blog/", "/blog"],
  ["/privacy-policy/", "/privacy-policy"],
  ["/terms-of-service/", "/terms-of-service"],
  ["/wp-content/uploads/2026/02/mbs-favicon.svg", "/favicon.svg"],
]);

for (const icon of [
  "business-term",
  "business-line",
  "revenue-based",
  "euipment-financing",
  "sba-loan",
  "invoice-factory",
  "apply-online",
  "get-matched",
  "compare-offers",
  "get-funded",
  "one-application",
  "multiple-options",
  "fast-decisions",
  "dedicated-support",
]) {
  redirects.set(
    `/wp-content/uploads/2026/02/${icon}.svg`,
    `/images/icons/${icon}.svg`,
  );
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

const pageMetadata = new Map([
  [
    "/",
    {
      title: "My Business Solutions | Smart Business Funding, Simplified",
      description:
        "Apply once and access multiple business funding options tailored to your company's needs. Compare offers, choose confidently, and move forward faster.",
    },
  ],
  [
    "/about",
    {
      title: "Our Story | My Business Solutions",
      description:
        "One desk. More ways to get it done. Learn why MBS was built and meet founder and CEO Nate Ford.",
    },
  ],
  [
    "/products",
    {
      title: "Business Financing Products | My Business Solutions",
      description:
        "Explore term loans, lines of credit, revenue-based financing, equipment financing, SBA loans, and invoice factoring.",
    },
  ],
  [
    "/calculator",
    {
      title: "Business Funding Calculator | My Business Solutions",
      description:
        "Estimate your business loan payments with our interactive calculator. Adjust funding amount, term, and rate to preview monthly, bi-weekly, weekly, or daily payments.",
    },
  ],
  [
    "/contact",
    {
      title: "Contact Us | My Business Solutions",
      description:
        "Get in touch with the My Business Solutions team. We reply within one business day.",
    },
  ],
  [
    "/blog",
    {
      title: "Business Funding Blog | My Business Solutions",
      description:
        "Practical guides on business funding — working capital, term loans, bank statements, and how to prepare your application.",
    },
  ],
  [
    "/blog/working-capital-vs-term-loans",
    {
      title:
        "Working capital vs. term loans: which fits your business? | My Business Solutions",
      description:
        "Two of the most common ways small businesses access financing — but they serve very different purposes. Here's how to tell which one fits your situation.",
    },
  ],
  [
    "/blog/what-lenders-look-at-bank-statements",
    {
      title:
        "What lenders actually look at in your bank statements | My Business Solutions",
      description:
        "Bank statements are the first thing most business lenders want to see. Understanding what they're looking for helps you put your best foot forward.",
    },
  ],
  [
    "/blog/how-to-prepare-your-funding-application",
    {
      title:
        "How to prepare your business funding application | My Business Solutions",
      description:
        "Knowing what to gather before you apply makes the process faster and helps you put your strongest application forward.",
    },
  ],
  [
    "/privacy-policy",
    {
      title: "Privacy Policy | My Business Solutions",
      description:
        "My Business Solutions privacy policy — how we collect, use, and protect your personal information.",
    },
  ],
  [
    "/terms-of-service",
    {
      title: "Terms of Service | My Business Solutions",
      description:
        "Read the My Business Solutions Terms of Service governing your use of our website and services.",
    },
  ],
]);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderPageHtml(pathname, metadata, noIndex) {
  const canonicalUrl = new URL(pathname, siteUrl).toString();
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const robots = noIndex ? "noindex, follow" : "index, follow";

  return indexHtml
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace(
      /<meta name="robots" content="[^"]*" \/>/,
      `<meta name="robots" content="${robots}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${description}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${title}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${description}" />`,
    )
    .replace(
      /<meta name="twitter:url" content="[^"]*" \/>/,
      `<meta name="twitter:url" content="${canonicalUrl}" />`,
    );
}

function sendFile(request, response, filePath, statusCode = 200) {
  const stats = statSync(filePath);
  const isFingerprintedAsset = filePath.startsWith(join(publicDir, "assets"));
  const cacheControl =
    extname(filePath) === ".html"
      ? "no-cache"
      : isFingerprintedAsset
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate";
  const etag = `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
  const lastModified = stats.mtime.toUTCString();
  const requestEtag = request.headers["if-none-match"];
  const requestModifiedSince = request.headers["if-modified-since"];
  const notModified =
    requestEtag === etag ||
    (!requestEtag &&
      requestModifiedSince &&
      new Date(requestModifiedSince).getTime() >=
        Math.floor(stats.mtimeMs / 1000) * 1000);

  const headers = {
    "Cache-Control": cacheControl,
    "Content-Length": stats.size,
    "Content-Type":
      mimeTypes[extname(filePath).toLowerCase()] ??
      "application/octet-stream",
    ETag: etag,
    "Last-Modified": lastModified,
  };
  if (notModified) {
    response.writeHead(304, {
      "Cache-Control": cacheControl,
      ETag: etag,
      "Last-Modified": lastModified,
    });
    response.end();
    return;
  }

  response.writeHead(statusCode, headers);
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
}

function sendPage(request, response, pathname, metadata, statusCode) {
  const body = Buffer.from(
    renderPageHtml(pathname, metadata, statusCode === 404),
    "utf8",
  );
  response.writeHead(statusCode, {
    "Cache-Control": "no-cache",
    "Content-Length": body.length,
    "Content-Type": "text/html; charset=utf-8",
  });
  response.end(request.method === "HEAD" ? undefined : body);
}

createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const url = new URL(request.url ?? "/", "http://localhost");
  const redirect = redirects.get(url.pathname);
  if (redirect) {
    response.writeHead(301, {
      "Cache-Control": "public, max-age=3600",
      Location: redirect,
    });
    response.end();
    return;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const relativePath = normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(publicDir, relativePath);
  if (
    filePath.startsWith(publicDir) &&
    existsSync(filePath) &&
    statSync(filePath).isFile()
  ) {
    sendFile(request, response, filePath);
    return;
  }

  const isAssetRequest = extname(decodedPath) !== "";
  if (isAssetRequest) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const metadata = pageMetadata.get(decodedPath);
  if (metadata) {
    sendPage(request, response, decodedPath, metadata, 200);
    return;
  }

  sendPage(
    request,
    response,
    decodedPath,
    {
      title: "Page Not Found | My Business Solutions",
      description: "The requested page could not be found.",
    },
    404,
  );
}).listen(port, "0.0.0.0", () => {
  console.log(`MBS website listening on port ${port}`);
});