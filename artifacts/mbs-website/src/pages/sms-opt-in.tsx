import { Layout } from "@/components/layout/layout";
import { Reveal } from "@/components/motion/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";

const CONSENT_TEXT =
  "I agree to receive text messages from My Business Solutions LLC about my application (application received, documents needed, status updates). Message frequency varies. Message and data rates may apply. Reply STOP to cancel, HELP for help. See our Privacy Policy and Terms of Service.";

export default function SmsOptIn() {
  usePageMeta(
    "SMS Opt-In | My Business Solutions",
    "Evidence of the SMS consent process used by My Business Solutions LLC.",
  );

  return (
    <Layout>
      <section
        className="pt-28 pb-16 md:pt-36 md:pb-20"
        style={{ background: "linear-gradient(160deg, #0E2A47 0%, #1F4E79 100%)" }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white">
              SMS Opt-In — My Business Solutions LLC
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="space-y-8">
              <p className="text-muted-foreground leading-relaxed text-base">
                Business owners opt in to text messages by checking the box below on our online
                financing application at{" "}
                <a
                  href="https://app.my-business-solutions.com/apply"
                  className="text-primary underline underline-offset-4 hover:text-accent transition-colors"
                >
                  https://app.my-business-solutions.com/apply
                </a>
                .
              </p>

              <img
                src={`${import.meta.env.BASE_URL}sms-opt-in.png`}
                alt="SMS consent checkbox on the MBS financing application"
                className="w-full rounded-2xl border border-border shadow-sm"
              />

              <blockquote className="rounded-xl border border-border bg-muted/40 p-6 text-foreground leading-relaxed">
                “{CONSENT_TEXT}”
              </blockquote>

              <div className="space-y-3 text-muted-foreground leading-relaxed text-base">
                <p>The box is unchecked by default and is separate from the credit authorization.</p>
                <p>
                  Consent is recorded with a timestamp and IP address. No messages are sent to
                  anyone who has not checked the box.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <a
                  href="https://my-business-solutions.com/privacy-policy"
                  className="text-primary underline underline-offset-4 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://my-business-solutions.com/terms-of-service"
                  className="text-primary underline underline-offset-4 hover:text-accent transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}