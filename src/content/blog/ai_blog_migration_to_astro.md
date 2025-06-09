---
title: 'Automating Blog Content Migration to Astro Using AI Agents'
description: 'Automating the migration of blog articles from platforms like Medium and WordPress to the content-driven Astro framework.'
pubDate: 'May 28 2025'
heroImage: '/blog-placeholder-1.jpg'
---

## Introduction

Blog content migration typically involves significant manual effort. Moving content from platforms like Medium or WordPress requires copying, reformatting, and restructuring content. This guide demonstrates how to automate this process using AI agents to migrate content to Astro efficiently.

## Astro Framework Overview

[Astro](https://astro.build/) is a modern web framework designed for building fast, content-focused websites. The framework implements a "server-first" approach, delivering lightweight HTML to browsers while minimizing JavaScript usage. It supports data loading from multiple sources including file systems, external APIs, and CMS platforms. The framework integrates seamlessly with JavaScript UI components, CSS libraries, and themes.

## Content Structure in Astro: Markdown and Frontmatter

Astro uses Markdown files with frontmatter - a metadata section at the top of each file enclosed between triple dashes (---). This structure enables content organization through properties like titles, descriptions, dates, and custom data. The frontmatter system provides a clean way to manage content rendering within components. ([Astro Markdown Docs](https://docs.astro.build/en/concepts/why-astro/?utm_source=chatgpt.com))

## Migration Challenges

Content migration from WordPress to Astro presents several challenges. As documented in [this article](https://levelup.gitconnected.com/how-and-why-i-moved-my-blog-from-wordpress-to-astro-and-markdown-3549672d5a86), the process requires manual content copying, individual image downloads, and handling of legacy posts. The absence of efficient Markdown conversion tools makes the migration process time-consuming and error-prone.

## AI Agent Systems

AI agents and multi-agent platforms provide a solution for automating complex tasks. These systems utilize autonomous agents with specific roles and capabilities. Each agent can process information, make decisions, and execute tasks. Through proper orchestration, these agents can automate complex workflows and reduce manual intervention.

## KaibanJS Framework: JavaScript's AI Orchestrator

[KaibanJS](https://www.kaibanjs.com/) is a JavaScript framework for building and managing multi-agent systems. Based on Kanban principles, it enables the definition of agents with specific roles and tasks. The framework's compatibility with JavaScript/TypeScript and support for both client and server environments makes it suitable for integrating AI agents into existing projects.

## Implementation Guide

This section outlines the implementation of an AI-powered blog migration system through a series of steps.

### Step 1: Setting Up Our Astro Project

The implementation begins with creating an Astro project using the blog template:

```bash
npm create astro@latest
```

When prompted, select the blog template as it includes the necessary structure and components for a content-driven website.

### Step 2: Installing Dependencies

The system requires several dependencies for the migration interface, using React and Tailwind CSS:

```bash
npm install @astrojs/react react react-dom @astrojs/tailwind tailwindcss postcss autoprefixer lucide-react
```

### Step 3: Configuration Setup

The development environment requires the following configuration:

1. Create `postcss.config.mjs`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

2. Create `tailwind.config.mjs`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#45a049'
      }
    }
  },
  plugins: []
};
```

3. Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), react(), tailwind()]
});
```

### Step 4: AI Framework Integration

The system integrates [KaibanJS](https://www.kaibanjs.com/) for AI agent management:

```bash
npm install kaibanjs @kaibanjs/tools
```

### Step 5: AI Team Configuration

The implementation uses two specialized AI agents for the migration process:

1. **Content Fetcher Agent**: Handles web content retrieval and processing. The agent uses the [JinaUrlToMarkdown](https://docs.kaibanjs.com/tools-docs/kaibanjs-tools/JinaUrlToMarkdown) tool to convert web pages into Markdown format. JinaUrlToMarkdown was selected for its native Markdown output and API key-free operation.

2. **Content Cleaner Agent**: Manages content formatting for Astro. The agent processes raw Markdown content, applies the schema from `content.config.ts`, and generates the final Markdown file with appropriate frontmatter.

#### Team Inputs

The team requires two primary inputs:

- `url`: The source article URL
- `schema`: The content schema from `content.config.ts` defining required frontmatter

```typescript
// src/teams/blog-migration-team.ts
import { Agent, Task, Team } from 'kaibanjs';
import { JinaUrlToMarkdown } from '@kaibanjs/tools';

// === JinaUrlToMarkdown Tool ===
const jinaTool = new JinaUrlToMarkdown({
  apiKey: import.meta.env.PUBLIC_JINA_API_KEY || ''
});

// === Content Fetcher Agent ===
const contentFetcher = new Agent({
  name: 'Mr. Fetcher',
  role: 'Web blog articles Content Specialist',
  goal: 'Fetch and extract web content data for Blog articles migration',
  background: 'Expert in web blog articles content data extraction ',
  //@ts-ignore
  tools: [jinaTool]
});

// === Content Cleaner Agent ===
const contentCleaner = new Agent({
  name: 'Sr. Cleaner',
  role: 'Astro blogging platform content structure specialist',
  goal: 'Clean and structure markdown content with proper frontmatter for Astro blogging platform',
  background: 'Expert in markdown formatting and content structuring'
});

// === Tasks ===
const tasks = [
  new Task({
    title: 'Fetch and extract web blog articles content data',
    description: `Fetch the content from the provided {url} and extract data and content related to the article.
    
    Focus on preserving the article's content, structure and formatting including images and other media.
    Add metadata extracted from tool.
    Remove any unnecessary non-article's content elements from the markdown content such as:
    - Navigation links
    - Social media buttons
    - Comments sections
    - Related articles
    - Any other non-article's content elements`,
    expectedOutput: `Clean response with metadata and processing content from a blog article`,
    agent: contentFetcher
  }),
  new Task({
    title: 'Clean and markdown Structure Content for Astro blogging platform',
    description: `Clean up the following blog article content and return it as a Markdown file ready for use in the Astro blogging platform.
At the top of the file, include a valid YAML frontmatter block using only the fields defined in the provided schema.
{schema}

Requirements:
	•	The frontmatter must be at the very top, surrounded by --- delimiters.
	•	Use correct YAML syntax, no formatting or indentation errors.
	•	Populate all required schema fields with appropriate and coherent values based on the article content.
	•	If a required field is a date and no clear value is found in the content, use the current date ${
    new Date().toISOString().split('T')[0]
  }.
	•	For optional fields, do not include them if the content does not provide clear information.
	•	Do not add extra fields not defined in the schema.
	•	After the frontmatter, include the cleaned and well-formatted Markdown content.
  • Focus on preserving the article's content, structure and formatting including images and other media.
`,
    expectedOutput:
      'Structured markdown file with proper frontmatter and clean content for Astro blogging platform',
    agent: contentCleaner
  })
];

// === Team ===
const blogMigrationTeam = new Team({
  name: 'Blog Migration Team',
  agents: [contentFetcher, contentCleaner],
  tasks: tasks,
  inputs: {
    url: 'https://example.com/blog-post',
    schema: ''
  },
  env: {
    OPENAI_API_KEY: import.meta.env.PUBLIC_OPENAI_API_KEY || ''
  }
});

export default blogMigrationTeam;
```

### Step 6: API Key Management

The demo implementation uses Zustand for API key management:

```typescript
// src/teams/apiKeyStore.ts
import { create } from 'zustand';

interface ApiKeyStore {
  apiKeys: {
    openai: string;
    jina: string;
  };
  setApiKey: (name: string, value: string) => void;
}

export const useApiKeyStore = create<ApiKeyStore>(set => ({
  apiKeys: {
    openai: '',
    jina: ''
  },
  setApiKey: (name, value) =>
    set(state => ({
      apiKeys: { ...state.apiKeys, [name]: value }
    }))
}));
```

For production use, API keys can be configured in the `.env` file:

```bash
PUBLIC_OPENAI_API_KEY=your_openai_api_key
PUBLIC_JINA_API_KEY=your_jina_api_key
```

The keys can then be accessed in the code:

```js
OPENAI_API_KEY: import.meta.env.PUBLIC_OPENAI_API_KEY || '';
JINA_API_KEY: import.meta.env.PUBLIC_JINA_API_KEY || '';
```

### Step 7: Migration User Interface Implementation

The project includes a web interface for content migration with the following features:

- Article URL input
- OpenAI API key configuration
- Optional Jina API key setup
- Migration request submission
- Markdown content preview

The interface provides real-time workflow visualization:

- Agent status monitoring
- Task progress tracking
- Error reporting
- Output preview

```typescript
// src/components/ImportForm.tsx
// (Note: The full implementation is available in the repository)
// Here's a simplified version of our main component:

export const ImportForm: React.FC<ImportFormProps> = ({ schema }) => {
  // ... component implementation
  return (
    <div className='max-w-7xl mx-auto py-8 px-4'>
      {/* Form for URL input */}
      {/* Real-time workflow visualization */}
      {/* Results display */}
    </div>
  );
};
```

### Step 8: Page Integration

The import page serves as the main entry point for the migration process. The frontmatter schema from `content.config.ts` is passed to the ImportForm component to ensure proper content structure.

![Blog Import UI](/blog-migration-ui.png)

```astro
---
// src/pages/import.astro
import { ImportForm } from '../components/ImportForm';
---

<ImportForm schema={/* your schema */} />
```

Update the header component:

```astro
---
// src/components/Header.astro
---
<header>
  <nav>
    <a href="/import">Import Posts</a>
  </nav>
</header>
```

### Step 9: Project Launch

Start the development server:

```bash
npm run dev
```

### Step 10: Migration Process

The migration process follows these steps:

1. **Input the URL**: Enter the source article URL in the input field.
   ![Input the URL](/url-input.png)

2. **Start Migration**: Initiate the process by clicking "Import Post". The system will:

   - Initialize the KaibanJS workflow
   - Show real-time status updates of both agents
   - Display task progress and any potential issues

3. **Monitor the Process**: You can watch as the agents work:

   - The Content Fetcher agent retrieves and purifies the content
   - The Content Cleaner agent structures the content with proper frontmatter
   - The workflow status updates in real-time

4. **Review the Result**: Once the migration is complete, you'll see:
   ![Edit the content](/result-edit.png)
   - Migrated content preview
   - Complete Markdown file with frontmatter
   - Options for:
     - Content editing
     - Markdown copying
     - File download

The migrated content maintains:

- The original article's structure and formatting
- All images and media content
- Proper Markdown syntax
- Astro-compatible frontmatter
  ![Migration Result Preview](/result-preview.png)

The system is now operational for blog migrations. The AI agents work together to process and format content for Astro blogs, streamlining the migration process.

![Migration Result Preview](/result-complete.png)

## Try It Yourself!

Want to experience the power of AI-driven blog migration? Check out our live demo and source code:

- 🚀 [Live Demo](https://astro-kaibanjs-migrator-demo.vercel.app/import) - Test the migration tool
- 📦 [GitHub Repository](https://github.com/anthonydevs17/astro-kaibanjs-migrator-demo) - Access the source code

Feel free to fork the repository, experiment with the code, and adapt it to your needs. Contributions and feedback are always welcome!

## Conclusion

The implementation of AI agents through KaibanJS demonstrates the effectiveness of automated content migration. The system efficiently processes content for modern frameworks like Astro, reducing manual effort and improving workflow efficiency. As AI technology advances, its role in development automation continues to expand.
