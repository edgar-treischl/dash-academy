# Guided Tours (driver.js)

Guided tours show first-time users around a page. The first one is on `RetentionPage` (`/retention`).

## Files

| File | Purpose |
|------|---------|
| `src/services/tourService.ts` | Saves whether a user has seen a tour. Defines the `TourStateService` interface plus `LocalStorageTourService` (used now) and `ApiTourService` (example backend version). |
| `src/hooks/useGuidedTour.ts` | React hook. Starts the tour on the first visit and returns `startTour()` for replay buttons. |
| `src/tours/retentionTour.ts` | Tour ID and steps for the Retention page. |
| `src/pages/RetentionPage.tsx` | Uses the hook, marks elements with `data-tour="…"` and renders the **"Tour starten"** button. |

## How driver.js works

[driver.js](https://driverjs.com) dims the page, highlights one element at a time and shows a popover next to it. A tour is a list of **steps**:

```ts
{
  element: '[data-tour="retention-chart"]', // CSS selector (or an element)
  popover: {
    title: "Wiederholungsquoten",
    description: "Text, HTML allowed",
    side: "right",   // top | right | bottom | left
    align: "center", // start | center | end
  },
}
```

A step without `element` shows a centered popover (good for intro or outro steps).

Flow in `useGuidedTour`:

1. On mount, the hook calls `tourService.hasSeenTour(tourId)`.
2. If the tour hasn't been seen, it starts after 300 ms, so the chart has time to render.
3. Steps whose element isn't on the page are skipped.
4. When the tour closes (finished or quit early), `onDestroyed` calls `markTourSeen(tourId)`.
5. `startTour()` replays the tour any time.

## Adjusting a tour

- **Change text or order:** edit the steps array in `src/tours/retentionTour.ts`.
- **Highlight a new element:** add `data-tour="my-id"` to the element, then add a step with `element: '[data-tour="my-id"]'`. Use `data-tour` attributes rather than CSS classes, so later style changes don't break the tour.
- **Global options** (button labels, progress text, closing): change the `driver({...})` call in `useGuidedTour.ts`. Useful options:
  - `animate`
  - `overlayOpacity`
  - `stagePadding`
  - `allowClose`
  - `showButtons`
  - `popoverClass`

  The full list is at <https://driverjs.com/docs/configuration>.
- **Styling:** the default CSS comes from `driver.js/dist/driver.css`. To theme it, set `popoverClass: "my-tour"` and target `.driver-popover.my-tour` in CSS.
- **Show the tour again after a big change:** bump the ID, e.g. `RETENTION_TOUR_ID = "retention-page-v2"`. Every user then sees it once more.
- **Reset locally:** in DevTools, run `localStorage.removeItem("dash-learning:tour-seen:retention-page")`.

## Switching to a real backend

All persistence goes through the `TourStateService` interface:

```ts
interface TourStateService {
  hasSeenTour(tourId: string): Promise<boolean>;
  markTourSeen(tourId: string): Promise<void>;
  resetTour(tourId: string): Promise<void>;
}
```

1. Implement the endpoints, or adjust `ApiTourService` to match your API. The example expects:
   - `GET    {baseUrl}/tours/:tourId` → `{ "seen": boolean }`
   - `PUT    {baseUrl}/tours/:tourId` with body `{ "seen": true }`
   - `DELETE {baseUrl}/tours/:tourId`

   Requests send cookies (`credentials: "include"`). Add auth headers or tokens in `ApiTourService` if needed.
2. Change one line at the bottom of `tourService.ts`:

   ```ts
   export const tourService: TourStateService = new ApiTourService("/api");
   ```

No page or hook changes are needed.

Notes:

- `hasSeenTour` returns `false` on a non-OK response, and the hook ignores errors, so a failing backend never blocks the page.
- **Optional fallback:** write a small service that tries the API first and falls back to `LocalStorageTourService`.
- **Per-page override:** pass `service` to the hook instead of changing the global default, e.g. `useGuidedTour({ ..., service: myService })`.

## Reusing it in other views or apps

**Another view in this app:**

1. Create `src/tours/<page>Tour.ts` that exports a tour ID and a steps array.
2. Add `data-tour` attributes to the page.
3. Call the hook and wire up a replay button:

```tsx
const { startTour } = useGuidedTour({ tourId: MY_TOUR_ID, steps: myTourSteps });
// optional: useGuidedTour({ ..., autoStart: false }) for replay-only tours
<button type="button" onClick={startTour}>Tour starten</button>
```

**Another app or micro frontend:**

1. Run `yarn add driver.js`.
2. Copy `src/services/tourService.ts` and `src/hooks/useGuidedTour.ts`. They depend only on React and driver.js.
3. Change `STORAGE_PREFIX` in `tourService.ts`, or use globally unique tour IDs. Several MFEs can share one origin's localStorage, so keys could collide otherwise.
4. If many apps need this, consider moving both files into a shared package (e.g. `@edgar-treischl/dash-ui`).
