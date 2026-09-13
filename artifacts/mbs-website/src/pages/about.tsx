import { Layout } from "@/components/layout/layout";
import { CinematicVideo } from "@/components/motion/CinematicVideo";
import { Reveal } from "@/components/motion/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { buildApplyUrl } from "@/lib/applyUrl";

const services = [
  "Equipment finance.",
  "Working capital.",
  "Commercial financing.",
  "Structured transactions.",
];

export default function About() {
  usePageMeta(
    "Our Story | My Business Solutions",
    "One desk. More ways to get it done. Learn why MBS was built and meet founder and CEO Nate Ford.",
  );

  return (
    <Layout mainClassName="flex-1">
      <CinematicVideo
        src="/videos/about-city.mp4"
        poster="/videos/about-city-poster.jpg"
        eager
        ariaLabel="Our story"
        className="min-h-[100dvh] flex items-center pt-24"
        overlay="linear-gradient(105deg, rgba(8,25,43,0.94) 0%, rgba(14,42,71,0.84) 55%, rgba(14,42,71,0.55) 100%)"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#31D18C]">
              MY BUSINESS SOLUTIONS
            </p>
            <h1 className="max-w-4xl font-heading text-5xl font-bold leading-[1.02] text-white md:text-7xl">
              One desk. More ways to get it done.
            </h1>
          </Reveal>
        </div>
      </CinematicVideo>

      <section className="bg-[#F5F8FB] py-24 md:py-36">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-12 text-xl leading-relaxed text-[#243B53] md:text-3xl md:leading-relaxed">
            <Reveal><p>Business finance has become unnecessarily complicated.</p></Reveal>
            <Reveal><p>Too many handoffs. Too many forms. Too many people involved in what should be a straightforward decision.</p></Reveal>
            <Reveal><p className="font-heading text-3xl font-bold text-[#0E2A47] md:text-5xl">We built MBS differently.</p></Reveal>
          </div>

          <div className="my-16 grid gap-px overflow-hidden rounded-2xl border border-[#DCE4EC] bg-[#DCE4EC] sm:grid-cols-2">
            {services.map((service, index) => (
              <Reveal key={service} delay={index * 70}>
                <p className="h-full bg-white p-7 font-heading text-xl font-semibold text-[#0E2A47] md:p-9 md:text-2xl">
                  {service}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="space-y-12 text-xl leading-relaxed text-[#243B53] md:text-3xl md:leading-relaxed">
            <Reveal><p>One relationship. One process. One place to start.</p></Reveal>
            <Reveal><p>Some deals are simple. Some require a little more thought.</p></Reveal>
            <Reveal><p className="font-heading text-3xl font-bold text-[#0E2A47] md:text-5xl">We know the difference.</p></Reveal>
            <Reveal><p>MBS combines experienced underwriting, real-world dealmaking and a growing finance platform designed to keep more of the process under one roof.</p></Reveal>
            <Reveal><p>No noise. No unnecessary runaround.</p></Reveal>
            <Reveal><p>Just clear answers and people who know what they’re looking at.</p></Reveal>
            <Reveal>
              <p className="border-l-4 border-[#17A567] py-4 pl-7 font-heading text-4xl font-bold leading-tight text-[#0E2A47] md:text-6xl">
                Business financing, without the maze.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#0E2A47] py-24 text-white md:py-36">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#31D18C]">NATE FORD</p>
            <h2 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Founder &amp; CEO</h2>
          </Reveal>
          <div className="space-y-7 text-lg leading-relaxed text-white/76 md:text-xl">
            <Reveal><p>Nate Ford has spent more than 15 years inside commercial finance.</p></Reveal>
            <Reveal><p className="font-heading text-2xl font-semibold leading-snug text-white md:text-3xl">Not studying it from the outside.<br />Actually doing it.</p></Reveal>
            <Reveal><p>His career has included roles with companies such as Bank of Cardiff, Balboa Capital and Ascentium Capital, along with senior leadership positions throughout the equipment finance industry.</p></Reveal>
            <Reveal><p>He has worked with business owners, equipment vendors, manufacturers, sales organizations and finance companies across nearly every side of a transaction.</p></Reveal>
            <Reveal><p>That experience became the foundation for MBS.</p></Reveal>
            <Reveal><p>The idea was simple:</p></Reveal>
            <Reveal><div className="space-y-3 border-l-2 border-[#17A567] pl-6 text-white"><p>Take what the industry does well. Remove what it doesn’t.</p><p>Less passing deals around.</p><p>Less unnecessary process.</p><p>Better judgment.</p><p>Better communication.</p><p>And one company capable of handling more of a client’s financing needs as the relationship grows.</p></div></Reveal>
            <Reveal><p>Nate also serves on the NEFA Rising Professionals Committee, helping support the next generation of professionals in the equipment finance industry.</p></Reveal>
            <Reveal><p>After 15+ years in the business, his approach is pretty simple:</p></Reveal>
            <Reveal><blockquote className="pt-5 font-heading text-3xl font-bold leading-tight text-[#31D18C] md:text-5xl">Know the deal. Know the business. Then get to work.</blockquote></Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-center md:py-28">
        <Reveal>
          <div className="mx-auto max-w-3xl px-6">
            <a href={buildApplyUrl("about-page")} target="_blank" rel="noopener noreferrer" className="btn-primary px-8">
              Apply now
            </a>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}