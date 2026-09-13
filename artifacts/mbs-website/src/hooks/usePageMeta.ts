import { useEffect } from "react";

const SITE_URL = "https://my-business-solutions.com";

type PageMetaOptions = {
  noIndex?: boolean;
};

function setMeta(
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  let tag = document.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function usePageMeta(
  title: string,
  description = "",
  options: PageMetaOptions = {},
) {
  useEffect(() => {
    document.title = title;

    const path =
      window.location.pathname === "/"
        ? "/"
        : window.location.pathname.replace(/\/+$/, "");
    const canonicalUrl = new URL(path, SITE_URL).toString();

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      options.noIndex ? "noindex, follow" : "index, follow",
    );
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:url"]', "name", "twitter:url", canonicalUrl);

    if (description) {
      setMeta(
        'meta[name="description"]',
        "name",
        "description",
        description,
      );
      setMeta(
        'meta[property="og:description"]',
        "property",
        "og:description",
        description,
      );
      setMeta(
        'meta[name="twitter:description"]',
        "name",
        "twitter:description",
        description,
      );
    }
  }, [description, options.noIndex, title]);
}
