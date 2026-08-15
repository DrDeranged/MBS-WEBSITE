import { Link } from "wouter";

export function Footer() {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/calculator", label: "Calculator" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <footer className="bg-foreground text-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="bg-white px-3 py-2 rounded-xl inline-flex">
                <img
                  src="/images/mbs-logo-footer.png"
                  alt="My Business Solutions"
                  className="h-10 object-contain"
                />
              </div>
            </Link>
            <p className="text-cloud/80 text-lg max-w-xs">
              Smart business funding, simplified.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-4 text-cloud/80">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a 
                  href="https://app.my-business-solutions.com/apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-accent font-medium"
                >
                  Apply Now
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-white">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-4 text-cloud/80">
              <li>Contact support or sales to find the right funding for you.</li>
              <li>
                <Link href="/contact" className="text-white underline underline-offset-4 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-cloud/60">
          <p>© 2026 My Business Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
