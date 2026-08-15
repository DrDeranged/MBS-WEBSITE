import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "wouter";

export default function NotFound() {
  usePageMeta("Page Not Found | My Business Solutions");
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="max-w-md">
          <p
            className="font-heading font-bold text-[96px] leading-none mb-4"
            style={{ color: "#DCE4EC" }}
          >
            404
          </p>
          <h1 className="text-3xl font-bold text-foreground mb-4">Page not found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full text-white px-6 py-3 font-semibold transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: "#1F4E79" }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
