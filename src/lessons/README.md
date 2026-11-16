# Adding Lessons to the Learning Platform

This guide shows how to add new lessons to the learning platform using markdown files.

## Directory Structure

Lessons are organized by module in `src/lessons/`:

```
src/lessons/
├── foundations/
│   ├── lesson-1/
│   │   ├── lesson.json       # Metadata
│   │   └── content.md        # Markdown content
│   ├── lesson-2/
│   └── lesson-3/
├── working-with-data/
│   ├── lesson-4/
│   └── ...
├── data-analysis/
├── visualization/
└── data-in-practice/
```

## Creating a New Lesson

### Step 1: Create the Directory

Create a new folder for your lesson:

```bash
mkdir -p src/lessons/{module-id}/{lesson-id}
```

Replace:
- `{module-id}` with one of: `foundations`, `working-with-data`, `data-analysis`, `visualization`, `data-in-practice`
- `{lesson-id}` with the lesson identifier (e.g., `lesson-1`, `lesson-4`)

### Step 2: Create `lesson.json`

Create `src/lessons/{module-id}/{lesson-id}/lesson.json` with metadata:

```json
{
  "id": "lesson-4",
  "title": "Understanding SQL Basics",
  "description": "Learn the fundamentals of SQL queries.",
  "durationMinutes": 15,
  "order": 1
}
```

**Fields:**
- `id`: Unique lesson identifier (must match directory name)
- `title`: Display title in UI
- `description`: Short description shown in module overview
- `durationMinutes`: Estimated reading/completion time
- `order`: Position within the module (1-based)

### Step 3: Create `content.md`

Create `src/lessons/{module-id}/{lesson-id}/content.md` with markdown content:

```markdown
# Understanding SQL Basics

Learn the fundamentals of SQL queries and how to fetch data from databases.

## What is SQL?

SQL (Structured Query Language) is the standard language for querying databases.

### Basic Query Structure

A simple SELECT query:

\`\`\`sql
SELECT column1, column2 FROM table_name WHERE condition;
\`\`\`

### Common Keywords

- **SELECT**: Choose which columns to retrieve
- **FROM**: Specify which table
- **WHERE**: Filter results with conditions
- **ORDER BY**: Sort results

> 💡 Tip: Always think about what data you need before writing a query.
```

## Markdown Features Supported

### Headings
```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
`Inline code`
```

### Code Blocks
````markdown
```sql
SELECT * FROM users;
```

```python
import pandas as pd
```
````

### Lists
```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Tables
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
| Value 3  | Value 4  |
```

### Blockquotes
```markdown
> This is a quote or important note
```

## Step 4: Register the Lesson

Add the lesson ID to the module's `lessonIds` in `src/data/lessonMetadata.ts`:

```typescript
export const modules: LearningModule[] = [
  {
    id: "working-with-data",
    title: "Working with Data",
    description: "Understand and work with data.",
    icon: "table",
    order: 2,
    lessonIds: ["lesson-4", "lesson-5", "lesson-6", "lesson-7"] // Add new ID here
  },
  // ...
];
```

## Embedding React Components

Use a registered component on its own lines, with an optional JSON object for props:

```markdown
::: component SalesChart
{
  "title": "Example sales",
  "data": [
    { "month": "January", "sales": 12000 },
    { "month": "February", "sales": 15000 }
  ]
}
:::
```

The component renders at that position, between the surrounding Markdown sections.
See `foundations/lesson-1/content.md` for a working example. Inside fenced code
blocks, directives remain literal examples and do not render components.

To add another component, create its React file and add a lazy import to
`src/components/lessons/componentRegistry.ts`. Only registered components can be
embedded; arbitrary JavaScript or JSX is not executed. Invalid JSON or a missing
closing `:::` prevents the lesson from loading and logs the error to the console.
Unknown component names show an error in the lesson.

## Examples

### Example 1: Simple Lesson

**File:** `src/lessons/foundations/lesson-4/lesson.json`
```json
{
  "id": "lesson-4",
  "title": "Introduction to Datasets",
  "description": "Understand what datasets are and how they're structured.",
  "durationMinutes": 12,
  "order": 4
}
```

**File:** `src/lessons/foundations/lesson-4/content.md`
```markdown
# Introduction to Datasets

A dataset is a collection of data organized in a structured format.

## Dataset Components

- **Rows**: Individual records
- **Columns**: Attributes or fields
- **Values**: Data points

## Common Formats

| Format | Use Case |
|--------|----------|
| CSV | Spreadsheet data |
| JSON | Web APIs |
| SQL | Databases |
| Parquet | Big data analytics |
```

### Example 2: Lesson with Multiple Sections

```markdown
# Advanced Data Visualization

Learn techniques for creating compelling data visualizations.

## Color Principles

- Choose colors carefully for accessibility
- Use color to highlight important information
- Avoid rainbow color schemes

## Chart Types

### Bar Charts
Best for comparing values across categories.

### Line Charts
Perfect for showing trends over time.

### Scatter Plots
Use to identify correlations between variables.

## Best Practices

> Always include a title and legend on your visualizations.
> Label your axes clearly.
> Use colors that are colorblind-friendly.
```

## Tips for Writing Lessons

1. **Keep it simple**: Focus on one concept per lesson
2. **Use examples**: Concrete examples help understanding
3. **Add visuals**: Use tables, lists, and formatting
4. **Include tips**: Use blockquotes for helpful hints
5. **Progress logically**: Build from basics to advanced
6. **Test links**: Ensure any references are accurate
7. **Use consistent formatting**: Follow markdown conventions

## Editing Existing Lessons

To edit an existing lesson, simply modify the `content.md` file:

```bash
# Edit the markdown file in your editor
nano src/lessons/foundations/lesson-1/content.md

# Or use VSCode
code src/lessons/foundations/lesson-1/content.md
```

The changes will be reflected automatically when you reload the page (in development mode).

## Viewing Lessons in the App

1. Start the dev server: `yarn dev`
2. Navigate to a module: Click "Learning Path" → Select a module
3. Click on a lesson to view the content
4. Content is rendered from your markdown file

## Troubleshooting

### Lesson not appearing
- Check the lesson ID matches the directory name
- Verify the lesson is added to `lessonIds` in the module
- Check the browser console for any errors

### Markdown not rendering correctly
- Ensure the `.md` file uses proper markdown syntax
- Check for missing colons or brackets
- Verify headings start with `#`

### Images not loading
- Currently images must be imported separately
- Use relative URLs if images are in the same directory

## Future Enhancements

- Dynamic image embedding in markdown
- Lesson versioning
- Translations
- Student notes and annotations
