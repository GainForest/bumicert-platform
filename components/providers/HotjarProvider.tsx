"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

import { trackPageViewed } from "@/lib/analytics";

type HotjarProviderProps = {
  children: React.ReactNode;
};

const CONTENTSQUARE_SCRIPT_URL = "https://t.contentsquare.net/uxa/e5d0827d9d269.js";

// Separate component for route tracking that uses useSearchParams
// This must be wrapped in Suspense for Next.js static generation
const RouteTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip tracking on first render (already tracked during initialization)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const url = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    trackPageViewed({
      path: url,
      title: typeof document !== "undefined" ? document.title : undefined,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
    });
  }, [pathname, searchParams]);

  return null;
};

const HotjarProvider = ({ children }: HotjarProviderProps) => {
  const pathname = usePathname();
  const hasTrackedInitialPageView = useRef(false);

  const handleScriptLoad = () => {
    console.log("[Contentsquare/Hotjar] Script loaded successfully");
    console.log("[Contentsquare/Hotjar] window.hj available:", typeof window.hj);
    console.log("[Contentsquare/Hotjar] window.hj:", window.hj);
    
    // Check for Contentsquare-specific objects
    console.log("[Contentsquare/Hotjar] window._uxa available:", typeof (window as unknown as Record<string, unknown>)._uxa);
    console.log("[Contentsquare/Hotjar] window.CS available:", typeof (window as unknown as Record<string, unknown>).CS);

    // Track initial page view once script is loaded
    if (!hasTrackedInitialPageView.current) {
      hasTrackedInitialPageView.current = true;
      trackPageViewed({
        path: pathname,
        title: typeof document !== "undefined" ? document.title : undefined,
        referrer:
          typeof document !== "undefined" ? document.referrer : undefined,
      });
    }
  };

  return (
    <>
      <Script
        src={CONTENTSQUARE_SCRIPT_URL}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={(e) => {
          console.error("[Contentsquare/Hotjar] Failed to load script:", e);
        }}
      />
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
      {children}
    </>
  );
};

export default HotjarProvider;
