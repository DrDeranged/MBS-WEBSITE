import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { MbsAssist } from '@/components/MbsAssist';

import Home from '@/pages/home';
import Calculator from '@/pages/calculator';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import Blog from '@/pages/blog';
import PrivacyPolicy from '@/pages/privacy-policy';
import TermsOfService from '@/pages/terms-of-service';

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
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.15 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      {/* Silently strip trailing slashes from any URL */}
      <TrailingSlashRedirect />
      <PageTransition>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/blog" component={Blog} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          {/* Legacy WordPress route → external apply URL */}
          <Route path="/get-started">
            {() => <ExternalRedirect to="https://app.my-business-solutions.com/apply" />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
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
          <MbsAssist />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
