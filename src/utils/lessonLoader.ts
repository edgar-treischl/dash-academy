import type { Lesson } from "../types/learning";
import { parseMarkdownToBlocks } from "./markdownParser";

/**
 * Lesson loader - dynamically imports markdown-based lessons
 * 
 * Directory structure:
 * src/lessons/{module-id}/lesson-{id}/
 *   ├── lesson.json (metadata)
 *   └── content.md (markdown content)
 */

interface LessonMetadata {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  order: number;
}

const metadataFiles = import.meta.glob<LessonMetadata>(
  "../lessons/*/*/lesson.json",
  { import: "default" }
);
const contentFiles = import.meta.glob<string>(
  "../lessons/*/*/content.md",
  { query: "?raw", import: "default" }
);

/**
 * Load a lesson from the file system
 * This function imports the lesson metadata and content dynamically
 */
async function loadLessonFile(
  moduleId: string,
  lessonId: string
): Promise<Lesson | null> {
  try {
    const lessonPath = `../lessons/${moduleId}/${lessonId}`;
    const loadMetadata = metadataFiles[`${lessonPath}/lesson.json`];
    const loadContent = contentFiles[`${lessonPath}/content.md`];

    if (!loadMetadata || !loadContent) {
      throw new Error(`Missing lesson.json or content.md in ${lessonPath}`);
    }

    const [metadata, markdownContent] = await Promise.all([
      loadMetadata(),
      loadContent(),
    ]);

    const lesson: Lesson = {
      id: metadata.id,
      moduleId,
      title: metadata.title,
      description: metadata.description,
      durationMinutes: metadata.durationMinutes,
      order: metadata.order,
      content: parseMarkdownToBlocks(markdownContent, lessonId),
    };

    return lesson;
  } catch (error) {
    console.error(`Failed to load lesson ${lessonId} from module ${moduleId}:`, error);
    return null;
  }
}

/**
 * Cache for loaded lessons to avoid re-importing
 */
const lessonCache = new Map<string, Promise<Lesson | null>>();

/**
 * Get a lesson by ID, loading from file system
 * Uses caching to avoid re-imports (disabled in development)
 */
export async function getLesson(
  moduleId: string,
  lessonId: string
): Promise<Lesson | null> {
  const cacheKey = `${moduleId}/${lessonId}`;
  const isDev = import.meta.env.DEV;

  if (!isDev && lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey) || null;
  }

  const lesson = await loadLessonFile(moduleId, lessonId);
  if (!isDev) {
    lessonCache.set(cacheKey, Promise.resolve(lesson));
  }

  return lesson;
}
