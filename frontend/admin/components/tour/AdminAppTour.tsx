"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, HelpCircle, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type TourStep = {
  selector?: string;
  path: string;
  title: string;
  description: string;
};

const STORAGE_KEY_PREFIX = "udan-admin-tour-complete";

const steps: TourStep[] = [
  {
    path: "/",
    selector: '[data-tour="admin-sidebar"]',
    title: "Admin modules",
    description: "The sidebar is the operations map for bookings, drivers, vehicles, tours, rentals, pricing, settings, and audit logs.",
  },
  {
    path: "/",
    selector: '[data-tour="admin-status"]',
    title: "Dispatch status",
    description: "The header shows the current workspace and the live Ujjain dispatch status so admins can keep context while moving between modules.",
  },
  {
    path: "/",
    selector: '[data-tour="admin-dashboard-actions"]',
    title: "Daily control center",
    description: "The dashboard summarizes current operations and routes admins into live bookings or driver management.",
  },
  {
    path: "/",
    selector: '[data-tour="admin-stats"]',
    title: "Operational statistics",
    description: "These cards surface the important queues: total bookings, pending dispatch, active drivers, fleet, tours, and rentals.",
  },
  {
    path: "/bookings",
    selector: '[data-tour="admin-booking-filters"]',
    title: "Booking triage",
    description: "Admins filter by booking details, status, and date before inspecting a ride or assigning dispatch updates.",
  },
  {
    path: "/bookings",
    selector: '[data-tour="admin-bookings-table"]',
    title: "Ride operations",
    description: "The bookings table is where staff inspect customer requests, route details, schedules, payment context, and driver assignment state.",
  },
  {
    path: "/drivers",
    selector: '[data-tour="admin-driver-actions"]',
    title: "Driver roster",
    description: "Driver management keeps the dispatch pool current so live bookings can be assigned to verified available drivers.",
  },
];

export function AdminAppTour() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, justLoggedInUserId } = useAuth();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const userTourKey = useMemo(() => {
    const userKey = user?.id || user?.email || "unknown";
    return `${STORAGE_KEY_PREFIX}:${userKey}`;
  }, [user?.email, user?.id]);

  const completeTour = useCallback(() => {
    localStorage.setItem(userTourKey, "true");
    setActive(false);
    setTargetRect(null);
  }, [userTourKey]);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setActive(true);
  }, []);

  useEffect(() => {
    if (
      loading ||
      pathname === "/login" ||
      !user ||
      !justLoggedInUserId ||
      justLoggedInUserId !== (user.id || user.email) ||
      localStorage.getItem(userTourKey) === "true"
    ) {
      return;
    }

    const timer = window.setTimeout(() => setActive(true), 900);
    return () => window.clearTimeout(timer);
  }, [justLoggedInUserId, loading, pathname, user, userTourKey]);

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

  if (loading || !user || pathname === "/login") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={startTour}
        className="fixed bottom-6 right-6 z-[80] inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/95 text-zinc-200 shadow-xl backdrop-blur transition hover:border-red-500 hover:text-red-400"
        aria-label="Start admin tour"
        title="Start admin tour"
      >
        <HelpCircle size={20} />
      </button>

      {active && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="absolute inset-0 bg-black/70" />
          {targetRect && (
            <div
              className="absolute rounded-2xl border-2 border-red-500 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.66),0_0_32px_rgba(239,68,68,0.45)] transition-all"
              style={{
                top: Math.max(8, targetRect.top - 8),
                left: Math.max(8, targetRect.left - 8),
                width: Math.min(window.innerWidth - 16, targetRect.width + 16),
                height: targetRect.height + 16,
              }}
            />
          )}

          <section
            className={`pointer-events-auto fixed ${cardPosition} w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-100 shadow-2xl`}
            aria-live="polite"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Admin App Tour {stepIndex + 1}/{steps.length}
                </p>
                <h2 className="mt-1 text-lg font-extrabold tracking-tight">{step.title}</h2>
              </div>
              <button
                type="button"
                onClick={completeTour}
                className="rounded-full p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Close tour"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm leading-6 text-zinc-400">{step.description}</p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                disabled={stepIndex === 0}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-700 px-4 text-sm font-bold text-zinc-100 transition hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={() => (isLastStep ? completeTour() : setStepIndex((current) => current + 1))}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-500"
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
