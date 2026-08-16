import post1Raw from "./blog/working-capital-vs-term-loans.md?raw";
import post2Raw from "./blog/what-lenders-look-at-bank-statements.md?raw";
import post3Raw from "./blog/how-to-prepare-your-funding-application.md?raw";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  /** Raw markdown body. When present, blog-article renders this instead of sections[]. */
  body: string;
  /** Legacy section fallback – kept for backward compat, not rendered when body is set. */
  sections: { heading?: string; body: string }[];
}

const APPLY_URL = "https://app.my-business-solutions.com/apply";
export { APPLY_URL };

export const POSTS: BlogPost[] = [
  {
    slug: "working-capital-vs-term-loans",
    title: "Working capital vs. term loans: which fits your business?",
    date: "August 1, 2026",
    readTime: "5 min read",
    excerpt:
      "Two of the most common ways small businesses access financing — but they serve very different purposes. Here's how to tell which one fits your situation.",
    body: post1Raw,
    sections: [],
  },
  {
    slug: "what-lenders-look-at-bank-statements",
    title: "What lenders actually look at in your bank statements",
    date: "August 8, 2026",
    readTime: "5 min read",
    excerpt:
      "Bank statements are the first thing most business lenders want to see. Understanding what they're looking for helps you put your best foot forward.",
    body: post2Raw,
    sections: [],
  },
  {
    slug: "how-to-prepare-your-funding-application",
    title: "How to prepare your business funding application",
    date: "August 15, 2026",
    readTime: "5 min read",
    excerpt:
      "Knowing what to gather before you apply makes the process faster and helps you put your strongest application forward.",
    body: post3Raw,
    sections: [],
  },
];
