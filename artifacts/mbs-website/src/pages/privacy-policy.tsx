import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Reveal } from "@/components/motion/Reveal";

// Verbatim text from https://my-business-solutions.com/privacy-policy/
const SECTIONS = [
  {
    heading: null,
    body: "Your privacy is very important to My Business Solutions. Accordingly, we have developed this Policy in order for you to understand how we collect, use, communicate and disclose, and make use of personal information. The following outlines our privacy policy.",
  },
  {
    heading: "General considerations",
    body: "Before or at the time of collecting personal information, we will identify the purposes for which information is being collected. We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned. We will collect and use personal information solely with the objective of fulfilling those purposes specified by us and for other compatible purposes, unless we obtain the consent of the individual concerned or as required by law. We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use, or modification. We will make readily available to customers information about our policies and practices relating to the management of personal information. Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date.",
  },
  {
    heading: "Data Collection and Usage",
    body: "We collect specific personal information necessary to facilitate communication services, including your phone number and any metadata associated with SMS, text messages, and voice calls. This data is used exclusively to route messages, connect calls, and ensure the technical performance of our platform. We also process usage logs to maintain service reliability and provide customer support when requested.",
  },
  {
    heading: "Third-Party Disclosure and Marketing",
    body: "We maintain a strict policy against the sharing of your communication data. Your phone number, message content, and call history are never sold, traded, or shared with third parties for their independent use. Furthermore, we confirm that none of the information collected through our SMS or calling services will be used for marketing purposes. You will not receive unsolicited promotional material, and your data will not be utilized to build advertising profiles or shared with external marketing agencies.",
  },
  {
    heading: "In short",
    body: "We are committed to conducting our business in accordance with these principles in order to ensure that the confidentiality of personal information is protected and maintained.",
  },
];

export default function PrivacyPolicy() {
  usePageMeta(
    "Privacy Policy | My Business Solutions",
    "My Business Solutions privacy policy — how we collect, use, and protect your personal information.",
  );

  return (
    <Layout>
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section
        className="pt-28 pb-16 md:pt-36 md:pb-20"
        style={{ background: "linear-gradient(160deg, #0E2A47 0%, #1F4E79 100%)" }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
              My Business Solutions (MBS) &bull; Last updated: March 13, 2026
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-10">
            {SECTIONS.map((sec, i) => (
              <Reveal key={i} delay={i * 50}>
                <div>
                  {sec.heading && (
                    <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-4">
                      {sec.heading}
                    </h2>
                  )}
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {sec.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
