# Copilot Instructions – dash-learning

## Project Overview

This is a React-based **Learning & Simulation Platform** built with **Vite**, **TypeScript**, and **React Router**. It's designed as a Micro Frontend (MFE) using Module Federation (`@originjs/vite-plugin-federation`).

The platform enables employees to develop data literacy and data science skills through realistic business scenarios in a protected, isolated environment with synthetic data.

**Key principle:** Reuse existing Shell infrastructure and UI components; keep learning and simulation decoupled from production applications.

## Build, Test & Lint Commands

Run all commands with **yarn** (not npm).

### Development
- **Start dev server:** `yarn dev` → runs on `localhost:5174`
- **Build for production:** `yarn build` → TypeScript check + Vite build. Watch for TS errors in `src/features/lessons/`.
- **Lint:** `yarn lint` → ESLint (TypeScript, React Hooks, React Refresh)
- **Preview production build:** `yarn preview`

### Important Notes
- Build runs `tsc -b` first, which is strict. Must pass before Vite build starts.
- No unit/integration test suite yet. Validation is manual or via CI workflows.
- The `base` in vite.config is `/dash-learning/` for GitHub Pages deployment.

## High-Level Architecture

### Project Structure
```
src/
├── app/                 # Application shell & routing
│   └── router.tsx       # React Router config with 4 routes
├── features/            # Feature modules (learning domain)
│   ├── dashboard/       # Entry point (DashboardPage)
│   ├── learning-path/   # Learning path overview
│   ├── modules/         # Module detail page
│   └── lessons/         # Lesson content rendering
├── components/          # Shared UI components
│   └── layout/          # Sidebar, Topbar layout components
├── layouts/             # Page layouts (AppLayout)
├── stores/              # Zustand state (progressStore)
├── data/                # Static learning data (lessons, modules, paths)
├── types/               # Shared TypeScript types
└── styles/              # Global CSS
```

### Data Flow & Domain Model

**Core Types** (from `src/types/learning.ts`):
- `LearningPath` → contains multiple modules
- `LearningModule` → contains multiple lessons
- `Lesson` → contains multiple content blocks
- `ContentBlock` → polymorphic: text, callout, or quiz
- `UserProgress` → tracks completed lessons, current lesson, achievements

**Static Data** (from `src/data/learning.ts`):
- All learning paths, modules, and lessons are defined as static JSON-like objects.
- No API integration yet (marked for future phases).

**State Management** (Zustand):
- `useProgressStore` → persists to localStorage as "data-literacy-progress"
- Tracks: `completedLessonIds`, `currentLessonId`, `earnedAchievementIds`
- Methods: `completeLesson()`, `setCurrentLesson()`, `resetProgress()`

### Routing (React Router)

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `DashboardPage` | Entry point |
| `/learning-path` | `LearningPathPage` | Overview of all modules |
| `/modules/:moduleId` | `ModulePage` | Module details + lesson list |
| `/lessons/:lessonId` | `LessonPage` | Lesson content + progress |

All routes nested under `AppLayout` → provides `Sidebar`, `Topbar`, and `<Outlet />`.

### Styling Approach

- **No Tailwind or utility frameworks**
- Uses **CSS Variables** and **scoped CSS classes** under `.app-layout`
- `src/styles/globals.css` contains layout and learning component styles.
- Import styles from `src/App.tsx` so they load in both standalone and Module Federation usage.

**Color scheme:** Light theme with navy and teal tokens defined on `.app-layout`.

### Module Federation Setup

- **MFE name:** `dash-learning`
- **Exposed entry:** `./src/App.tsx` as `./App`
- **Shared dependencies:** react, react-dom (auto-shared)
- **Remote entry:** `/dash-learning/remoteEntry.js`

Enables this module to be embedded in a larger Application Shell. Other shells import `App` from this MFE.

## Key Conventions

### File Organization
- **Feature modules** in `src/features/` → one directory per feature (dashboard, lessons, etc.)
- **Reusable components** in `src/components/` → only truly shared, not feature-specific
- **Type definitions** co-located in `src/types/` (single file for now, can grow)
- **Data files** in `src/data/` → static learning content, later replaced by API calls

### Component Patterns

1. **Default Exports:** All React components use default exports for page/feature components.
2. **Hooks Usage:** Use React Router hooks (`useParams`, `useNavigate`) and Zustand (`useProgressStore`) for state/routing.
3. **TypeScript Types:** Explicitly type component props and imports from `src/types/learning.ts`.
4. **Styling:** Use semantic class names defined in `src/styles/globals.css` (e.g., `className="learning-page learning-page--lesson"`). Do not use Tailwind utility classes.

Example component pattern:
```tsx
import { useParams } from "react-router-dom";
import { useProgressStore } from "../../stores/progressStore";

export default function MyFeature() {
  const { id } = useParams();
  const state = useProgressStore((s) => s.property);
  return <div>{/* render */}</div>;
}
```

### TypeScript Settings
- **Target:** ES2023, module: esnext
- **Strict mode enabled:** `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **JSX:** React 19 + automatic imports (no need for React import)
- **Module resolution:** bundler (Vite-aware)

### Naming Conventions
- **Components:** PascalCase (e.g., `LessonPage.tsx`, `LessonRenderer.tsx`)
- **Hooks:** `useXxx` prefix (e.g., `useProgressStore`)
- **Files:** kebab-case for directories, PascalCase for component files
- **CSS classes:** Layout classes and `.learning-*` component classes scoped under `.app-layout`

### Lesson Content Rendering
- `LessonRenderer` is a polymorphic component that handles three content block types:
  - **text:** heading + paragraph
  - **callout:** highlighted box (teal background)
  - **quiz:** question + multiple-choice answers (interaction stub)
- Add new block types by extending the `ContentBlock` union type and the switch statement.

### Progress Tracking
- Completion is per-lesson, not per-block.
- When a lesson is marked complete, Zustand persists to localStorage.
- Navigation after completion: jump to next lesson in same module, or back to module if last lesson.

## Future Directions

Based on the README's roadmap:
- **MVP (current):** Replace static data with Simulation Backend API calls
- **Mid-term:** Extract reusable Business Capabilities from production apps; standardize Data Contracts
- **Long-term:** Central Learning Path registry, Scenario Editor, Learning Analytics

When adding API integration:
- Create `src/api/` folder for service functions
- Keep Zustand store structure; hydrate from API responses
- Maintain separation: learning data lives in simulation backend, never in production APIs

## Common Pitfalls

- **Missing lesson data:** Check `src/data/learning.ts` for lesson ID + module ID pairing. Routes expect exact IDs.
- **Build failures:** TypeScript errors in `src/features/lessons/LessonPage.tsx` are common (possibly-undefined lesson check).
- **State not persisting:** Zustand uses localStorage key `"data-literacy-progress"`. Clear browser storage if tests need reset.
- **Styling conflicts:** Keep layout and component CSS scoped under `.app-layout` to prevent leakage into the host shell.
- **Module Federation quirks:** Build must succeed before MFE remoteEntry.js is valid. Clear dist/ if federation issues occur.
