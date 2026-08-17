"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, HelpCircle, X } from "lucide-react";

type TourStep = {
  selector?: string;
  path: string;
  title: string;
  description: string;
};

const STORAGE_KEY = "udan-client-tour-complete";

const steps: TourStep[] = [
  {
    path: "/",
    selector: '[data-tour="client-navbar"]',
    title: "Customer navigation",
    description: "Customers can move between services, fleet, destinations, tracking, and quick booking from the main navigation.",
  },
  {
    path: "/",
    selector: '[data-tour="client-booking-widget"]',
    title: "Ride booking",
    description: "This is the core booking flow: service type, pickup, destination, date, time, and available ride lookup.",
  },
  {
    path: "/",
    selector: '[data-tour="client-vehicles"]',
    title: "Vehicle choice",
    description: "Customers compare cab categories before choosing the best ride for city travel, airport transfers, or darshan trips.",
  },
  {
    path: "/",
    selector: '[data-tour="client-services"]',
    title: "Service discovery",
    description: "The home page explains the major customer journeys: city cabs, bike rentals, airport transfers, and pilgrimage packages.",
  },
  {
    path: "/track",
    selector: '[data-tour="client-track-search"]',
    title: "Booking tracking",
    description: "Customers can search by booking number or phone to view ride status, driver assignment, receipts, and cancellation options.",
  },
  {
    path: "/tours",
    selector: '[data-tour="client-tours-list"]',
    title: "Tour packages",
    description: "Spiritual tour packages are listed separately so customers can browse multi-stop itineraries and start a package booking.",
  },
];

export function ClientAppTour() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const completeTour = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setActive(false);
    setTargetRect(null);
  }, []);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setActive(true);
  }, []);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      return;
    }

    const timer = window.setTimeout(() => setActive(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!active || !step || pathname === step.path) {
      return;
    }

    router.push(step.path);
  }, [active, pathname, router, step]);

  useEffect(() => {
    if (!active || !step || pathname !== step.path) {
      return;
    }

    let attempts = 0;
    let frame = 0;

    const locateTarget = () => {
      const element = step.selector ? document.querySelector(step.selector) : null;
      if (element) {
        element.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
        window.setTimeout(() => setTargetRect(element.getBoundingClientRect()), 250);
        return;
      }

      setTargetRect(null);
      attempts += 1;
      if (attempts < 12) {
        frame = window.setTimeout(locateTarget, 150);
      }
    };

    locateTarget();

    const updateRect = () => {
      const element = step.selector ? document.querySelector(step.selector) : null;
      setTargetRect(element ? element.getBoundingClientRect() : null);
    };

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.clearTimeout(frame);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [active, pathname, step]);

  const cardPosition = useMemo(() => {
    if (!targetRect) {
      return "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
    }

    const useTop = targetRect.top > window.innerHeight / 2;
    return useTop
      ? "left-1/2 bottom-6 -translate-x-1/2"
      : "left-1/2 top-24 -translate-x-1/2";
  }, [targetRect]);

  return (
    <>
      <button
        type="button"
        onClick={startTour}
        className="fixed bottom-24 right-4 z-[80] inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/95 text-foreground shadow-xl backdrop-blur transition hover:border-primary hover:text-primary md:bottom-6"
        aria-label="Start application tour"
        title="Start application tour"
      >
        <HelpCircle size={20} />
      </button>

      {active && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="absolute inset-0 bg-black/65" />
          {targetRect && (
            <div
              className="absolute rounded-2xl border-2 border-primary bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.62),0_0_32px_rgba(220,38,38,0.45)] transition-all"
              style={{
                top: Math.max(8, targetRect.top - 8),
                left: Math.max(8, targetRect.left - 8),
                width: Math.min(window.innerWidth - 16, targetRect.width + 16),
                height: targetRect.height + 16,
              }}
            />
          )}

          <section
            className={`pointer-events-auto fixed ${cardPosition} w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-2xl`}
            aria-live="polite"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Client App Tour {stepIndex + 1}/{steps.length}
                </p>
                <h2 className="mt-1 text-lg font-extrabold tracking-tight">{step.title}</h2>
              </div>
              <button
                type="button"
                onClick={completeTour}
                className="rounded-full p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                aria-label="Close tour"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                disabled={stepIndex === 0}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground transition hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={() => (isLastStep ? completeTour() : setStepIndex((current) => current + 1))}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && <ArrowRight size={16} />}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
