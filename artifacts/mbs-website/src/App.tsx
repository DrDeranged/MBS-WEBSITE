import { lazy, Suspense, type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MbsAssistLauncher } from '@/components/MbsAssistLauncher';
import { buildApplyUrl } from '@/lib/applyUrl';

import Home from '@/pages/home';
const Calculator = lazy(() => import('@/pages/calculator'));
const About = lazy(() => import('@/pages/about'));
const Contact = lazy(() => import('@/pages/contact'));
const Blog = lazy(() => import('@/pages/blog'));
const BlogArticle = lazy(() => import('@/pages/blog-article'));
const PrivacyPolicy = lazy(() => import('@/pages/privacy-policy'));
const TermsOfService = lazy(() => import('@/pages/terms-of-service'));
const NotFound = lazy(() => import('@/pages/not-found'));

// ── Redirect helpers ──────────────────────────────────────────────────────────
/** Strips a trailing slash and navigates (client-side, replace) */
function TrailingSlashRedirect() {
  const [location, navigate] = useLocation();
  useEffect(() => {
    if (location !== '/' && location.endsWith('/')) {
      navigate(location.slice(0, -1), { replace: true });
    }
  }, [location, navigate]);
  return null;
}

/** Redirects to an external URL */
function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => { window.location.replace(to); }, [to]);
  return null;
}

const queryClient = new QueryClient();

function PageTransition({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const prefersReducedMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: prefersReducedMotion ? 0 : 0.15 } }}
        exit={{ opacity: 0, transition: { duration: prefersReducedMotion ? 0 : 0.1 } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function RouteFallback() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <span className={`h-8 w-8 rounded-full border-2 border-border border-t-primary ${prefersReducedMotion ? "" : "animate-spin"}`} />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      {/* Silently strip trailing slashes from any URL */}
      <TrailingSlashRedirect />
      <Suspense fallback={<RouteFallback />}>
        <PageTransition>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/calculator" component={Calculator} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogArticle} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />
            {/* Legacy WordPress route → external apply URL */}
            <Route path="/get-started">
              {() => <ExternalRedirect to={buildApplyUrl("get-started-redirect")} />}
            </Route>
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </Suspense>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
          <MbsAssistLauncher />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
