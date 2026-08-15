export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
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
    sections: [
      {
        heading: "The core difference",
        body: "A working capital loan (or line of credit) is designed for short-term needs — covering payroll during a slow month, bridging the gap while waiting on customer payments, or stocking up for a busy season. You draw on it, pay it down, and draw again. It's flexible by design.\n\nA term loan gives you a lump sum upfront that you repay on a fixed schedule over a defined period. It works best when you know exactly what you need the money for and can plan around the payments.",
      },
      {
        heading: "When working capital makes sense",
        body: "Working capital financing fits businesses that experience seasonal swings in revenue, carry outstanding invoices, or need to keep operations running smoothly between busy periods. If your cash flow is the problem — not a lack of assets or growth opportunity — working capital tools are often the right category to look at.",
      },
      {
        heading: "When a term loan makes sense",
        body: "Term loans are a better fit when you have a specific, one-time investment in mind: purchasing equipment, expanding your location, hiring a team for a new project, or refinancing higher-cost debt. Because the loan amount, rate, and term are fixed from the start, it's easier to budget around.",
      },
      {
        heading: "Questions to help you decide",
        body: "Ask yourself: Is this an ongoing cash flow issue or a one-time capital need? Do I want flexibility to draw and repay, or would a fixed schedule help me plan better? How long will I need the capital — a few months or several years? There's no single right answer, and many businesses use both products for different purposes.",
      },
      {
        heading: "Ready to explore your options?",
        body: `You don't have to decide in advance. Apply once through MBS and you'll see what you actually qualify for across multiple lenders — working capital, term loans, and more — so you can compare and choose what fits. [Apply now](${APPLY_URL})`,
      },
    ],
  },
  {
    slug: "what-lenders-look-at-bank-statements",
    title: "What lenders actually look at in your bank statements",
    date: "August 8, 2026",
    readTime: "4 min read",
    excerpt:
      "Bank statements are the first thing most business lenders want to see. Understanding what they're looking for helps you put your best foot forward.",
    sections: [
      {
        heading: "Why bank statements matter so much",
        body: "Lenders use your business bank statements to understand how your business actually operates — not how it looks on paper. Revenue on a tax return tells one story; consistent deposits into a business account tell another. Statements give lenders a real-time picture of cash flow, income patterns, and financial habits.",
      },
      {
        heading: "Average daily balance",
        body: "Lenders look at your average daily balance to gauge working capital health. A business that regularly runs near zero — or dips negative — signals that every dollar coming in is immediately going out. That makes lenders cautious. Healthy cushion doesn't mean a large number; it means enough to absorb a slow week or an unexpected expense.",
      },
      {
        heading: "Deposit volume and consistency",
        body: "How much comes in, and how regularly? Lenders want to see that revenue is real and consistent — not one large one-time deposit. Regular deposits across many transactions typically signal a healthy, operating business. Sudden spikes or long gaps between deposits can raise questions that you may need to explain.",
      },
      {
        heading: "Overdrafts and returned items",
        body: "Overdrafts and NSF (non-sufficient funds) events are red flags for most lenders. A handful over a long period may not be disqualifying, but frequent overdrafts suggest cash flow is under stress. If your statements show this pattern, it's worth being prepared to explain the context — or to work on stabilizing cash flow before applying.",
      },
      {
        heading: "How to prepare",
        body: `Most lenders ask for three to six months of business bank statements. Pull them now, review them yourself, and look for the patterns above. If something looks unusual, be ready to explain it. Transparency goes a long way. When you're ready, [apply through MBS](${APPLY_URL}) and we'll match you with lenders suited to your actual profile.`,
      },
    ],
  },
  {
    slug: "how-to-prepare-your-funding-application",
    title: "How to prepare your business funding application",
    date: "August 15, 2026",
    readTime: "4 min read",
    excerpt:
      "Knowing what to gather before you apply makes the process faster and helps you put your strongest application forward.",
    sections: [
      {
        heading: "What you'll typically need",
        body: "Most business funding applications ask for a short set of basic information: your business name, how long you've been in operation, monthly revenue, and what industry you're in. Beyond the basics, lenders almost always want recent business bank statements — typically three to six months — to verify your cash flow.",
      },
      {
        heading: "Gather your bank statements first",
        body: "Before anything else, pull three to six months of your most recent business bank statements from your bank's online portal. Make sure you have the full statements — not just summaries — and that they clearly show your business name and account number. These are the single most important documents in most applications.",
      },
      {
        heading: "Know your numbers",
        body: "You don't need to have everything memorized, but knowing your approximate monthly revenue, how long your business has been open, and what you plan to use the funds for will make the application process faster. Lenders may ask follow-up questions, and having a clear answer ready helps things move quickly.",
      },
      {
        heading: "Have a clear purpose in mind",
        body: "Lenders often ask what the funds will be used for. This isn't a trick question — it helps them match you with the right product. Equipment financing works differently from a working capital line. Knowing your goal (inventory, payroll bridge, expansion, equipment) helps you get the right offer.",
      },
      {
        heading: "What to expect after applying",
        body: "After you submit your application, it's reviewed and matched with lenders whose criteria fit your profile. You may be asked for additional documentation depending on the lender. The goal is to give you real options to compare — not a single take-it-or-leave-it offer.",
      },
      {
        heading: "Start today",
        body: `One application covers all six of MBS's funding products and multiple lender relationships. There's no obligation to accept an offer, and the process is straightforward. [Apply now and see your options](${APPLY_URL}).`,
      },
    ],
  },
];
