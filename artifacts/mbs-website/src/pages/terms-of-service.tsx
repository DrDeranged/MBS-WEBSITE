import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Reveal } from "@/components/motion/Reveal";

// Verbatim text from https://my-business-solutions.com/terms-of-service/
// Last updated: March 13, 2026
const INTRO = [
  "PLEASE READ THESE TERMS AND USE CAREFULLY. BY ACCESSING OUR SITES OR USING THE SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS OF SERVICE. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT USE THE SITE OR SERVICES AND MUST DISCONTINUE YOUR USE OF THE SITES AND SERVICES.",
  "These Terms of Service (the \"Terms of Service\") govern your use of the websites provided by My Business Solutions and its affiliates (dba \"MBS\", \"we\" or \"us\") whether accessed via computer, mobile device or otherwise (individually and collectively, the \"Sites\") as well as any products and services provided by MBS (the Sites, together with MBS, collectively referred to as the \"Service\").",
];

const SECTIONS = [
  {
    heading: "1. Acceptance of Agreement",
    body: "THESE TERMS OF SERVICE SET FORTH THE LEGALLY BINDING TERMS AND CONDITIONS THAT GOVERN YOUR USE OF THE SERVICE. BY COMPLETING THE REGISTRATION PROCESS AND/OR BROWSING THE SERVICE, YOU ARE ACCEPTING THESE TERMS OF SERVICE (ON BEHALF OF YOURSELF OR THE ENTITY THAT YOU REPRESENT), AND YOU REPRESENT AND WARRANT THAT YOU HAVE THE RIGHT, AUTHORITY, AND CAPACITY TO ENTER INTO THESE TERMS OF SERVICE. YOU MAY NOT ACCESS OR USE THE SITES OR SERVICE OR ACCEPT THESE TERMS OF SERVICE IF (A) YOU ARE NOT OF LEGAL AGE TO FORM A BINDING CONTRACT WITH MBS; (B) YOU ARE PROHIBITED BY LAW FROM RECEIVING OR USING THE SERVICE; OR (C) YOU ARE NOT A U.S. RESIDENT. IF YOU DO NOT AGREE WITH ALL OF THE PROVISIONS OF THESE TERMS OF SERVICE, DO NOT ACCESS AND/OR USE THE SITES OR SERVICE.\n\nPLEASE BE AWARE THAT THESE TERMS OF SERVICE REQUIRE THE USE OF ARBITRATION (SECTION 12) ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR CLASS ACTIONS, AND ALSO LIMIT THE REMEDIES AVAILABLE TO YOU IN THE EVENT OF A DISPUTE.\n\nYour use of, and participation in, the Service may be subject to additional terms (collectively, \"Supplemental Terms\") and such Supplemental Terms will either be listed in these Terms of Service or will be presented to you for your acceptance when you sign up to use the supplemental service. If these Terms of Service are inconsistent with the Supplemental Terms, the Supplemental Terms will control with respect to such Service. These Terms of Service and any applicable Supplemental Terms are referred to herein as the \"Agreement.\"",
  },
  {
    heading: "2. Amendments",
    body: "MBS reserves the right to amend these Terms of Service at any time. MBS will post notice of any amendment on the Sites. You should review these Terms of Service regularly to ensure that you are aware of future amendments. If you do not agree to any amendment, you must stop using the Sites and Service. If you have any questions about the terms and conditions in these Terms of Service or MBS's Privacy Policy, please contact us at support@my-business-solutions.com.\n\nWe reserve the right to update and revise this Policy at any time. You can determine if this Policy has been revised since your last visit by referring to the \"Updated on\" date at the top of this page. Your use of the Web site constitutes your acceptance of the terms of the Policy. You should review this Policy regularly to ensure that you are aware of future amendments.",
  },
  {
    heading: "3. Definitions and Interpretation",
    body: "Unless the context requires otherwise, capitalized terms in these Terms of Service shall have the following meanings:\n\n\"Account Information\" means information about accounts you maintain at third party websites, including, as applicable, your accounts at any financial institution, as provided by you to MBS.",
  },
  {
    heading: "13. General Provisions",
    body: "13.4 Entire Agreement. These Terms of Service constitute the entire agreement between you and MBS with regard to your use of the Site and the Services. Any and all other written or oral agreements or understandings previously existing between you and MBS with respect to such use are hereby superseded and cancelled.\n\n13.5 Severability. If any provision of these Terms of Service (or any portion thereof) is determined to be invalid or unenforceable, the remaining provisions of these Terms of Service shall not be affected thereby and shall be binding upon the parties and shall be enforceable, as though said invalid or unenforceable provision (or portion thereof) were not contained in these Terms of Service.\n\n13.6 Assignment. Neither these Terms of Service nor any rights hereunder may be transferred or assigned by either party without the prior written consent of the other party, which consent shall not be unreasonably withheld or delayed. Notwithstanding the foregoing, MBS may assign these Terms of Service or any rights hereunder without consent: (i) to an entity that acquires substantially all of its stock, assets or business; or (ii) to an Affiliate.\n\n13.7 Export. The Service may be subject to U.S. export control laws and may be subject to export or import regulations in other countries. You agree not to export, reexport, or transfer, directly or indirectly, any U.S. technical data acquired from MBS, or any products utilizing such data, in violation of the United States export laws or regulations.",
  },
  {
    heading: "14. Application Agreement",
    body: "When submitting your application, you agree to the following:\n\nI certify that my answers are true and complete to the best of my knowledge.\n\nBy signing below, each of the above listed Business Owner(s)/Officer(s)/Principal(s) and Business (individually and collectively, \"You\") certify that all information and documents submitted in connection with this Funding Application (\"Application\") are accurate, true, correct and complete; and that You will immediately notify My Business Solutions (\"MBS\") or any of its representatives, successors, assigns, designees, agents, partners or affiliates (\"Recipients\") of any change in such information or financial condition. You acknowledge that any false statements may be considered fraud. You acknowledge that the Recipients are relying on the information You provide. You further authorize MBS and each of the Recipients that may be involved with or acquire commercial loans having daily repayment features or purchases of future receivables including Merchant Cash Advance transactions (collectively, \"Transactions\") to obtain consumer or personal, business and investigative reports and other information about You, including, but not limited to credit card processor statements and bank statements, from one or more consumer reporting agencies, such as TransUnion, Experian and Equifax, and from other credit bureaus, banks, financial institutions, creditors and other third parties. You authorize Recipients to receive relevant information regarding the commercial lease for the above-referenced premises from our finance company and/or agent. You also authorize MBS to transmit this Application, along with any of the foregoing information obtained in connection with this Application, to any or all of the Recipients for the foregoing purposes. A photocopy of the Application will be deemed acceptable for release of credit and/or investigatory information.",
  },
  {
    heading: "15. Contact Information",
    body: "My Business Solutions (MBS)\n617 Palisade Ave. Unit 2\nJersey City, New Jersey 07307\n(908) 860-8507\nsupport@my-business-solutions.com",
  },
];

export default function TermsOfService() {
  usePageMeta(
    "Terms of Service | My Business Solutions",
    "Read the My Business Solutions Terms of Service governing your use of our website and services.",
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
              Terms of Service
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
          {/* Intro paragraphs */}
          <Reveal>
            <div className="space-y-4 mb-12">
              {INTRO.map((para, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Numbered sections */}
          <div className="space-y-10">
            {SECTIONS.map((sec, i) => (
              <Reveal key={i} delay={i * 40}>
                <div
                  className="border-t pt-8"
                  style={{ borderColor: "#DCE4EC" }}
                >
                  <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-4">
                    {sec.heading}
                  </h2>
                  <div className="space-y-3">
                    {sec.body.split("\n\n").map((para, pi) => (
                      <p key={pi} className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
