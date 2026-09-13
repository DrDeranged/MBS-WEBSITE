const APPLY_BASE_URL = "https://app.my-business-solutions.com/apply";

export type ApplySource =
  | "hero"
  | "header"
  | "products"
  | "cta-band"
  | "mini-calc"
  | "calculator"
  | `blog-${string}`
  | "contact-page"
  | "about-page"
  | "get-started-redirect";

type ApplyPrefill = {
  amount?: number | string;
  term?: number | string;
  freq?: string;
};

export function buildApplyUrl(source: ApplySource, prefill: ApplyPrefill = {}) {
  const url = new URL(APPLY_BASE_URL);
  url.searchParams.set("src", source);

  Object.entries(prefill).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}