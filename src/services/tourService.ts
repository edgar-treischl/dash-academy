/**
 * Persistence for "has the user already seen tour X?".
 * Swap the implementation in `tourService` below (e.g. to an API-backed one)
 * without touching consumers.
 */
export interface TourStateService {
  hasSeenTour(tourId: string): Promise<boolean>;
  markTourSeen(tourId: string): Promise<void>;
  resetTour(tourId: string): Promise<void>;
}

const STORAGE_PREFIX = "dash-learning:tour-seen:";

export class LocalStorageTourService implements TourStateService {
  async hasSeenTour(tourId: string): Promise<boolean> {
    try {
      return localStorage.getItem(STORAGE_PREFIX + tourId) === "true";
    } catch {
      return false;
    }
  }

  async markTourSeen(tourId: string): Promise<void> {
    try {
      localStorage.setItem(STORAGE_PREFIX + tourId, "true");
    } catch {
      // Storage unavailable (e.g. private mode); ignore.
    }
  }

  async resetTour(tourId: string): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_PREFIX + tourId);
    } catch {
      // ignore
    }
  }
}

/** Example backend implementation; enable by switching `tourService` below. */
export class ApiTourService implements TourStateService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private url(tourId: string) {
    return `${this.baseUrl}/tours/${encodeURIComponent(tourId)}`;
  }

  async hasSeenTour(tourId: string): Promise<boolean> {
    const res = await fetch(this.url(tourId), { credentials: "include" });
    if (!res.ok) return false;
    const body = (await res.json()) as { seen?: boolean };
    return body.seen === true;
  }

  async markTourSeen(tourId: string): Promise<void> {
    await fetch(this.url(tourId), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seen: true }),
    });
  }

  async resetTour(tourId: string): Promise<void> {
    await fetch(this.url(tourId), { method: "DELETE", credentials: "include" });
  }
}

// Switch to `new ApiTourService("/api")` once the backend exists.
export const tourService: TourStateService = new LocalStorageTourService();
