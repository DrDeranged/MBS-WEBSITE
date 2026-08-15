import { Layout } from "@/components/layout/layout";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  
  const fadeUpVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32 lg:py-40">
        {/* Abstract Background Decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[70%] rounded-full bg-muted/50 blur-3xl opacity-60" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              variants={fadeUpVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6"
            >
              Smart business funding, simplified
            </motion.h1>
            
            <motion.h2 
              variants={fadeUpVariants}
              className="text-2xl md:text-3xl font-heading text-primary font-semibold mb-6"
            >
              Get matched with the right financing
            </motion.h2>
            
            <motion.p 
              variants={fadeUpVariants}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl"
            >
              Apply once and access multiple business funding options tailored to your company's needs. Compare offers, choose confidently, and move forward faster.
            </motion.p>
            
            <motion.div 
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <a
                href="https://app.my-business-solutions.com/apply"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground px-8 py-4 text-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20"
              >
                Check your options
              </a>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-transparent border-2 border-border text-foreground px-8 py-4 text-lg font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                How it works
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works placeholder anchor */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground">
              A transparent, streamlined process to get the capital you need to grow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Apply Once</h3>
              <p className="text-muted-foreground">
                Complete one simple application to unlock multiple funding possibilities.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center font-heading font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Compare Offers</h3>
              <p className="text-muted-foreground">
                Review tailored financing options and choose the one that fits your goals.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Move Forward</h3>
              <p className="text-muted-foreground">
                Get funded quickly and focus on what matters most — growing your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to explore your options?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Take the first step toward securing the right financing for your business. It only takes a few minutes to get started.
          </p>
          <a
            href="https://app.my-business-solutions.com/apply"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground px-8 py-4 text-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
          >
            Check your options
          </a>
        </div>
      </section>
    </Layout>
  );
}
