/*
 * Adapted from “Loader” by forzayt (https://uiverse.io/forzayt/popular-dingo-38).
 * Copyright 2026 forzayt (_VISHNU_). Licensed under the MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions: The above copyright
 * notice and this permission notice shall be included in all copies or
 * substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
 * WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";

const MINIMUM_DISPLAY_MS = 1500;

function shouldShowForTransition(fromPathname: string | undefined, toPathname: string) {
  return (
    (fromPathname === "/" && toPathname === "/suite") ||
    (fromPathname === "/ready-to-label" && toPathname === "/ready-to-label/configure") ||
    (fromPathname?.startsWith("/ready-to-label/") &&
      fromPathname.endsWith("/report") &&
      toPathname === "/ready-to-label")
  );
}

/** Full-screen ECG wave shown for the approved post-authentication transitions. */
export function PageTransitionLoader() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const startedAt = useRef<number | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const clearDismissTimer = () => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
        dismissTimer.current = undefined;
      }
    };

    const show = ({
      fromLocation,
      pathChanged,
      toLocation,
    }: {
      fromLocation?: { pathname: string };
      pathChanged: boolean;
      toLocation: { pathname: string };
    }) => {
      if (!pathChanged || !shouldShowForTransition(fromLocation?.pathname, toLocation.pathname)) return;
      clearDismissTimer();
      startedAt.current = Date.now();
      setIsVisible(true);
    };

    const hide = () => {
      if (startedAt.current === null) return;
      const remaining = Math.max(0, MINIMUM_DISPLAY_MS - (Date.now() - startedAt.current));

      dismissTimer.current = setTimeout(() => {
        startedAt.current = null;
        dismissTimer.current = undefined;
        setIsVisible(false);
      }, remaining);
    };

    const unsubscribeBeforeNavigate = router.subscribe("onBeforeNavigate", show);
    const unsubscribeLoad = router.subscribe("onLoad", hide);

    return () => {
      clearDismissTimer();
      unsubscribeBeforeNavigate();
      unsubscribeLoad();
    };
  }, [router]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-background/60 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Loading next page"
    >
      <div className="relative h-[73px] w-[150px] overflow-hidden text-loading-wave" aria-hidden="true">
        <svg viewBox="0 0 150 73" className="size-full fill-none" focusable="false">
          <polyline
            className="page-transition-wave-line"
            points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="3"
          />
        </svg>
      </div>
      <span className="sr-only">Loading next page</span>
    </div>
  );
}
