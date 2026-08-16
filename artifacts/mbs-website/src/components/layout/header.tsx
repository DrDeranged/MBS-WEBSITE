import { Link, useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/calculator", label: "Calculator" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  // Trap focus / close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-background transition-all duration-300 ${
          scrolled
            ? "h-16 border-b border-border shadow-[0_2px_12px_rgba(14,42,71,0.08)]"
            : "h-20 border-b border-transparent"
        }`}
      >
        <div className={`mx-auto max-w-6xl px-6 flex items-center justify-between h-full`}>
          {/* Logo */}
          <Link href="/" className="flex items-center flex-none">
            <img
              src="/images/mbs-logo.png"
              alt="My Business Solutions"
              className={`object-contain transition-all duration-300 ${scrolled ? "h-8" : "h-9 sm:h-11"}`}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium [text-decoration:none] transition-colors duration-150 relative after:absolute after:left-0 after:w-full after:h-px after:rounded-full after:transition-transform after:duration-200 after:origin-left ${
                  location === link.href
                    ? "text-primary after:bg-[#17A567] after:scale-x-100 after:-bottom-[2px]"
                    : "text-foreground after:bg-[#17A567] after:scale-x-0 hover:text-primary hover:after:scale-x-100 after:-bottom-[2px]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://app.my-business-solutions.com/apply"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full text-white px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: "#17A567" }}
            >
              Apply Now
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-foreground"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      {/* Panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 z-50 h-full w-[80%] max-w-sm bg-background shadow-xl flex flex-col transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <img
            src="/images/mbs-logo.png"
            alt="My Business Solutions"
            className="h-8 object-contain"
          />
          <button
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col p-6 gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg font-medium px-3 py-3 rounded-lg transition-colors duration-150 ${
                location === link.href
                  ? "text-primary bg-primary/5"
                  : "text-foreground hover:text-primary hover:bg-muted"
              }`}
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.25s ease ${i * 50 + 80}ms, transform 0.25s ease ${i * 50 + 80}ms`,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-6 border-t border-border">
          <a
            href="https://app.my-business-solutions.com/apply"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full text-white px-6 py-3.5 text-base font-semibold"
            style={{ backgroundColor: "#17A567" }}
          >
            Apply Now
          </a>
        </div>
      </div>
    </>
  );
}
