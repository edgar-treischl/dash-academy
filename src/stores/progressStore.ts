
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProgress } from "../types/learning";

interface ProgressStore extends UserProgress {
  completeLesson: (lessonId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  resetProgress: () => void;
}

const initialProgress: UserProgress = {
  completedLessonIds: [],
  currentLessonId: "lesson-1",
  earnedAchievementIds: []
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      ...initialProgress,

      completeLesson: (lessonId) =>
        set((state) => ({
          completedLessonIds: [
            ...new Set([
              ...state.completedLessonIds,
              lessonId
            ])
          ]
        })),

      setCurrentLesson: (lessonId) =>
        set({ currentLessonId: lessonId }),

      resetProgress: () => set(initialProgress)
    }),
    {
      name: "data-literacy-progress"
    }
  )
);
