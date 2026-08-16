import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface LayoutProps {
  children: ReactNode;
  /**
   * Override the main element's className.
   * Default includes `pt-20` to clear the fixed header for inner pages.
   * Pass `"flex-1"` (no pt-20) for the home page whose hero is full-bleed
   * behind the transparent fixed header.
   */
  mainClassName?: string;
}

export function Layout({ children, mainClassName = "flex-1 pt-20" }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />
      <main className={mainClassName}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
