import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function PrivacyPolicy() {
  usePageMeta(
    "Privacy Policy | My Business Solutions",
    "Read the My Business Solutions privacy policy to understand how we collect, use, and protect your information.",
  );
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Full policy coming soon.
          </p>
        </div>
      </div>
    </Layout>
  );
}
