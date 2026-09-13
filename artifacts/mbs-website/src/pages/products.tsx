import { Layout } from "@/components/layout/layout";
import { CinematicVideo } from "@/components/motion/CinematicVideo";
import { Reveal } from "@/components/motion/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { buildApplyUrl } from "@/lib/applyUrl";

const products = [
  ["Business Term Loan", "Competitive rates and extended repayment terms designed to support your cash flow."],
  ["Business Line of Credit", "Flexible access to capital to help manage cash flow and fuel business growth."],
  ["Revenue-Based Financing", "Quick, straightforward funding so you can stay focused on running your business."],
  ["Equipment Financing", "Finance up to 100% of your equipment costs with industry-leading rates and terms."],
  ["SBA Loan", "A range of SBA loan options to help your business achieve long-term growth."],
  ["Invoice Factoring", "Turn outstanding invoices into immediate cash and eliminate long payment delays."],
];

export default function Products() {
  usePageMeta(
    "Business Financing Products | My Business Solutions",
    "Explore term loans, lines of credit, revenue-based financing, equipment financing, SBA loans, and invoice factoring.",
  );
  return (
    <Layout mainClassName="flex-1">
      <CinematicVideo
        src="/videos/products-machinery.mp4"
        poster="/videos/products-machinery-poster.jpg"
        eager
        ariaLabel="Business financing products"
        className="min-h-[72vh] flex items-center pt-24"
        overlay="linear-gradient(105deg, rgba(8,25,43,0.95), rgba(14,42,71,0.68))"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#31D18C]">Funding options</p>
            <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight text-white md:text-7xl">More ways to fund what comes next.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">Explore financing structures designed around how your business operates and where it is going.</p>
          </Reveal>
        </div>
      </CinematicVideo>

      <section className="bg-[#F5F8FB] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[#DCE4EC] bg-[#DCE4EC] md:grid-cols-2">
            {products.map(([title, copy], index) => (
              <Reveal key={title} delay={(index % 2) * 80}>
                <article className="h-full bg-white p-8 md:p-10">
                  <p className="mb-5 font-mono text-xs font-semibold tracking-widest text-[#17A567]">0{index + 1}</p>
                  <h2 className="font-heading text-2xl font-bold text-[#0E2A47] md:text-3xl">{title}</h2>
                  <p className="mt-4 leading-relaxed text-[#52677A]">{copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 text-center">
              <a href={buildApplyUrl("products")} target="_blank" rel="noopener noreferrer" className="btn-primary px-8">See your funding options</a>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}