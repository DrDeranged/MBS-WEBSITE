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

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Transparent on home hero; ink everywhere else
  const isHome = location === "/";
  const isTransparent = isHome && !scrolled;

  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-[#0E2A47] shadow-[0_2px_20px_rgba(0,0,0,0.28)]";

  const headerHeight = scrolled ? "h-16" : "h-20";

  const getLinkClass = (active: boolean) =>
    `text-sm font-medium [text-decoration:none] transition-colors duration-150 relative ` +
    `after:absolute after:left-0 after:w-full after:h-px after:rounded-full ` +
    `after:transition-transform after:duration-200 after:origin-left after:-bottom-[2px] ` +
    (active
      ? "text-white after:bg-[#17A567] after:scale-x-100"
      : "text-white/70 after:bg-[#17A567] after:scale-x-0 hover:text-white hover:after:scale-x-100");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg} ${headerHeight}`}
      >
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-full">
          {/* Logo — white variant (always on dark/transparent-over-dark bg) */}
          <Link href="/" className="flex items-center flex-none">
            <img
              src="/images/mbs-logo-footer.png"
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
                className={getLinkClass(location === link.href)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://app.my-business-solutions.com/apply"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-6"
            >
              Apply Now
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-white"
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
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      {/* Panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 z-50 h-full w-[80%] max-w-sm bg-[#0E2A47] shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <img
            src="/images/mbs-logo-footer.png"
            alt="My Business Solutions"
            className="h-8 object-contain"
          />
          <button
            className="p-2 -mr-2 text-white/50 hover:text-white transition-colors"
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
                  ? "text-white bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
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

        <div className="mt-auto p-6 border-t border-white/10">
          <a
            href="https://app.my-business-solutions.com/apply"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-base px-6"
          >
            Apply Now
          </a>
        </div>
      </div>
    </>
  );
}
