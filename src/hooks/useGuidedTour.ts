import { useCallback, useEffect, useRef } from "react";
import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { tourService, type TourStateService } from "../services/tourService";

interface UseGuidedTourOptions {
  tourId: string;
  steps: DriveStep[];
  /** Auto-start on first visit (default: true). */
  autoStart?: boolean;
  service?: TourStateService;
}

export function useGuidedTour({
  tourId,
  steps,
  autoStart = true,
  service = tourService,
}: UseGuidedTourOptions) {
  const driverRef = useRef<Driver | null>(null);

  const startTour = useCallback(() => {
    driverRef.current?.destroy();
    const availableSteps = steps.filter(
      (step) =>
        typeof step.element !== "string" || document.querySelector(step.element)
    );
    if (availableSteps.length === 0) return;

    const instance = driver({
      showProgress: true,
      allowClose: true,
      nextBtnText: "Weiter",
      prevBtnText: "Zurück",
      doneBtnText: "Fertig",
      progressText: "{{current}} von {{total}}",
      steps: availableSteps,
      onDestroyed: () => {
        void service.markTourSeen(tourId);
        driverRef.current = null;
      },
    });
    driverRef.current = instance;
    instance.drive();
  }, [service, steps, tourId]);

  useEffect(() => {
    if (!autoStart) return;
    let cancelled = false;
    let timer: number | undefined;

    service
      .hasSeenTour(tourId)
      .then((seen) => {
        if (cancelled || seen) return;
        // Defer so the page (and chart) has rendered before highlighting.
        timer = window.setTimeout(startTour, 300);
      })
      .catch(() => {
        // Never block the page if the persistence layer fails.
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [autoStart, service, startTour, tourId]);

  useEffect(() => () => driverRef.current?.destroy(), []);

  return { startTour };
}
