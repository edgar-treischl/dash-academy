/**
 * Learning data - now organized with markdown-based lessons
 * 
 * IMPORTANT MIGRATION GUIDE:
 * ===========================
 * Lessons are now stored as markdown files in src/lessons/{module}/{lesson-id}/
 * 
 * To add a new lesson:
 * 1. Create directory: src/lessons/{module-id}/{lesson-id}/
 * 2. Create lesson.json with metadata:
 *    {
 *      "id": "lesson-id",
 *      "title": "Lesson Title",
 *      "description": "Short description",
 *      "durationMinutes": 10,
 *      "order": 1
 *    }
 * 3. Create content.md with your markdown content
 * 4. Add lesson-id to the module's lessonIds in lessonMetadata.ts
 * 
 * Example lesson structure:
 * src/lessons/
 *   └── foundations/
 *       └── lesson-1/
 *           ├── lesson.json
 *           └── content.md
 */

export { learningPath, modules, achievements } from "./lessonMetadata";
