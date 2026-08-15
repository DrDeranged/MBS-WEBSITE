import { useState, useRef } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Reveal } from "@/components/motion/Reveal";

const SUBMIT_URL =
  "https://app.my-business-solutions.com/api/leads/capture/elementor";

type FormState = "idle" | "submitting" | "success" | "error";

function validate(fields: {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}): Partial<Record<keyof typeof fields, string>> {
  const errs: Partial<Record<keyof typeof fields, string>> = {};
  if (!fields.name.trim()) errs.name = "Full name is required.";
  if (!fields.company.trim()) errs.company = "Business name is required.";
  if (!fields.email.trim()) {
    errs.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errs.email = "Please enter a valid email address.";
  }
  if (!fields.phone.trim()) {
    errs.phone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(fields.phone.replace(/\D/g, ""))) {
    errs.phone = "Please enter a 10-digit phone number.";
  }
  if (!fields.message.trim()) errs.message = "Message is required.";
  if (!fields.consent)
    errs.consent = "You must agree to the terms to continue.";
  return errs;
}

export default function Contact() {
  usePageMeta(
    "Contact Us | My Business Solutions",
    "Get in touch with the My Business Solutions team. We reply within one business day.",
  );

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [status, setStatus] = useState<FormState>("idle");

  // Honeypot – bots fill this; humans don't see it
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fields = { name, company, email, phone, message, consent };
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    // Honeypot check — fake success if bot filled it
    if (honeypotRef.current?.value) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      const resp = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.replace(/\D/g, ""),
          message: message.trim(),
        }),
      });

      // Endpoint always returns 200 per spec
      if (resp.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full rounded-xl border px-4 py-3 text-sm text-foreground bg-background outline-none transition-colors placeholder:text-muted-foreground focus:ring-2";
  const inputStyle = (field: string) =>
    `${inputBase} ${errors[field] ? "border-red-400 focus:ring-red-200" : "border-border focus:border-primary focus:ring-primary/20"}`;

  return (
    <Layout>
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section
        className="pt-28 pb-20 md:pt-36 md:pb-28"
        style={{ background: "linear-gradient(160deg, #0E2A47 0%, #1F4E79 100%)" }}
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p
              className="font-sans font-semibold text-[12px] uppercase mb-4 tracking-widest"
              style={{ color: "#17A567" }}
            >
              Get in touch
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Contact Us
            </h1>
            <p className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>
              Have a question about business funding? We're here to help.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TWO-COLUMN BODY ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-5 gap-12 lg:gap-20">
            {/* ── LEFT: Form ───────────────────────────────────────────────── */}
            <div className="md:col-span-3">
              <Reveal>
                <h2 className="font-heading font-semibold text-2xl text-foreground mb-8">
                  Send us a message
                </h2>
              </Reveal>

              {status === "success" ? (
                <Reveal>
                  <div
                    className="rounded-2xl p-10 text-center"
                    style={{ background: "#F5F8FB", border: "1px solid #DCE4EC" }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ backgroundColor: "#17A567" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                      Message received!
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Thanks for reaching out. We'll be in touch within one business day.
                    </p>
                  </div>
                </Reveal>
              ) : (
                <form onSubmit={(e) => void handleSubmit(e)} noValidate>
                  {/* Hidden honeypot */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                  />

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Smith"
                        className={inputStyle("name")}
                        autoComplete="name"
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme LLC"
                        className={inputStyle("company")}
                        autoComplete="organization"
                      />
                      {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@acme.com"
                        className={inputStyle("email")}
                        autoComplete="email"
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 000-0000"
                        className={inputStyle("phone")}
                        autoComplete="tel"
                      />
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your business and what you're looking for…"
                      rows={5}
                      className={`${inputStyle("message")} resize-none`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                  </div>

                  {/* Consent checkbox */}
                  <div className="mb-8">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 flex-none w-4 h-4 rounded border-border"
                        style={{ accentColor: "#17A567" }}
                      />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        By contacting us, you agree to our{" "}
                        <Link
                          href="/terms-of-service"
                          className="underline hover:text-foreground transition-colors"
                        >
                          Terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy-policy"
                          className="underline hover:text-foreground transition-colors"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="mt-1 text-xs text-red-500 pl-7">{errors.consent}</p>
                    )}
                  </div>

                  {status === "error" && (
                    <div
                      className="mb-5 rounded-xl px-4 py-3 text-sm"
                      style={{ backgroundColor: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
                    >
                      Something went wrong. Please check your connection and try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center justify-center rounded-full text-white px-8 py-4 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none"
                    style={{ backgroundColor: "#17A567" }}
                  >
                    {status === "submitting" ? "Sending…" : "Send message"}
                  </button>
                </form>
              )}
            </div>

            {/* ── RIGHT: Contact details ────────────────────────────────────── */}
            <div className="md:col-span-2">
              <Reveal delay={120}>
                <div className="sticky top-28 space-y-8">
                  <h2 className="font-heading font-semibold text-2xl text-foreground">
                    Contact details
                  </h2>

                  {[
                    {
                      label: "Email",
                      value: "support@my-business-solutions.com",
                      href: "mailto:support@my-business-solutions.com",
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ),
                    },
                    {
                      label: "Phone",
                      value: "(908) 860-8507",
                      href: "tel:9088608507",
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16l.27.92z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#46586C" }}>
                        {item.label}
                      </p>
                      <a
                        href={item.href}
                        className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                        style={{ color: "#1F4E79" }}
                      >
                        {item.icon}
                        {item.value}
                      </a>
                    </div>
                  ))}

                  <div
                    className="rounded-xl p-5"
                    style={{ background: "#F5F8FB", border: "1px solid #DCE4EC" }}
                  >
                    <div className="flex items-start gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-none" style={{ color: "#17A567" }}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/>
                        <path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                      </svg>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We reply within one business day.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
