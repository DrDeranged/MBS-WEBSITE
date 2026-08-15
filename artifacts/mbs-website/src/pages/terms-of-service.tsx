import { Layout } from "@/components/layout/layout";

export default function TermsOfService() {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Full terms coming soon.
          </p>
        </div>
      </div>
    </Layout>
  );
}
