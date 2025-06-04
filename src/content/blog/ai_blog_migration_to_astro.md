---
title: '🚀 From Chaos to Cosmos: Migrating Blogs to Astro with AI Agents'
description: 'Automating the migration of blog articles from platforms like Medium and WordPress to the content-driven Astro framework.'
pubDate: 'May 28 2025'
heroImage: '/blog-placeholder-1.jpg'
---

## Introduction

In the ever-evolving digital landscape, generative AI has emerged as a formidable ally, transforming mundane tasks into automated marvels. Gone are the days when AI merely generated content; today, it interacts, executes actions, and integrates seamlessly into our traditional work platforms. This article delves into the orchestration of AI agents to automate the migration of blog articles from platforms like Medium and WordPress to the content-driven Astro framework.

## Meet Astro: The Star of Content-Driven Websites

[Astro](https://astro.build/) is a modern web framework designed for building fast, content-focused websites. It emphasizes a "server-first" approach, delivering lightweight HTML to browsers and minimizing unnecessary JavaScript. Astro's flexibility allows developers to load data from various sources, including file systems, external APIs, or preferred CMS platforms. Its customizable nature supports integration with popular JavaScript UI components, CSS libraries, themes, and more.

## Markdown and Frontmatter: Astro's Dynamic Duo

Astro leverages Markdown files enriched with frontmatter—a section at the beginning of a Markdown file enclosed between triple dashes (---) containing metadata about the content. This combination allows for structured content creation, enabling developers to define properties like titles, descriptions, dates, and custom data. Astro's support for frontmatter enhances content organization and rendering within components. ([Astro Markdown Docs](https://docs.astro.build/en/concepts/why-astro/?utm_source=chatgpt.com))

## The Manual Migration Maze

Migrating content from platforms like WordPress to Astro isn't a walk in the park. As highlighted in [this article](https://levelup.gitconnected.com/how-and-why-i-moved-my-blog-from-wordpress-to-astro-and-markdown-3549672d5a86), the process often involves manually copying and reformatting content, downloading images separately, and dealing with outdated posts. The lack of efficient tools for converting posts to Markdown can make the migration process daunting and time-consuming.

## Enter Agentic Systems: AI Agents to the Rescue

Agentic systems, comprising AI agents and multi-agent platforms, have revolutionized task automation. These systems consist of autonomous agents with specific roles and goals, capable of reasoning, planning, and executing tasks collaboratively. By orchestrating these agents, complex workflows can be automated, reducing human intervention and increasing efficiency.

## Introducing KaibanJS: JavaScript's AI Orchestrator

[KaibanJS](https://www.kaibanjs.com/) is a JavaScript-native framework for building and managing multi-agent systems. Inspired by Kanban principles, KaibanJS allows developers to define agents with specific roles and tasks, facilitating structured and efficient workflows. Its compatibility with JavaScript/TypeScript and client/server-side environments makes it an ideal choice for integrating AI agents into existing projects.

## Implementation: Automating Blog Migration with AI Agents

Let's explore the technical implementation of our AI-powered blog migration system. We'll break down the process into clear, manageable steps.

### Step 1: Setting Up Our Astro Project

First, we'll create our Astro project using the blog template, which provides an optimal foundation for content-focused websites:

```bash
npm create astro@latest
```

When prompted, select the blog template as it includes the necessary structure and components for a content-driven website.

### Step 2: Installing Dependencies

We'll need several key dependencies to build our migration system user interface, using React and Tailwind CSS for styling:

```bash
npm install @astrojs/react react react-dom @astrojs/tailwind tailwindcss postcss autoprefixer lucide-react
```

### Step 3: Configuration Setup

Let's configure our development environment with the necessary settings:

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

We'll integrate [KaibanJS](https://www.kaibanjs.com/) for orchestrating our AI agents:

```bash
npm install kaibanjs @kaibanjs/tools
```

### Step 5: AI Team Configuration

We've designed a team of two specialized AI agents that work together to handle the migration process efficiently. The team orchestrates the interaction between these agents, each with a specific role in the content migration workflow:

1. **Content Fetcher Agent**: This agent specializes in retrieving and purifying web content. It uses the [JinaUrlToMarkdown](https://docs.kaibanjs.com/tools-docs/kaibanjs-tools/JinaUrlToMarkdown) tool to convert web pages into Markdown format. While other tools like Firecrawl could be used for web content extraction, we chose JinaUrlToMarkdown for its native Markdown output and the ability to make multiple requests without requiring an API key.

2. **Content Cleaner Agent**: This agent focuses on formatting and structuring the content according to Astro's requirements. It processes the raw Markdown content, applies the schema defined in `content.config.ts`, and generates the final Markdown file with proper frontmatter metadata.

#### Team Inputs

The team accepts two main inputs:

- `url`: The URL of the article to be migrated
- `schema`: The content schema defined in `content.config.ts` that specifies the required frontmatter metadata for Astro content files

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

We'll implement a secure way to manage users API keys using Zustand for demo purposes:

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

But if you want to use your own API keys, you can do it by setting the API keys in the `.env` file:

```bash
PUBLIC_OPENAI_API_KEY=your_openai_api_key
PUBLIC_JINA_API_KEY=your_jina_api_key
```

and then you can use the `import.meta.env.PUBLIC_OPENAI_API_KEY ` and `import.meta.env.PUBLIC_JINA_API_KEY` to set the API keys:

```js
OPENAI_API_KEY: import.meta.env.PUBLIC_OPENAI_API_KEY || '';
JINA_API_KEY: import.meta.env.PUBLIC_JINA_API_KEY || '';
```

### Step 7: Migration User Interface Implementation

To facilitate user interaction, we developed a web interface that provides a seamless experience for content migration. The interface allows users to:

- Input the article URL they want to migrate
- Configure their OpenAI API key (required)
- Optionally set up their Jina API key
- Submit the migration request
- View the migrated content in Markdown format

A key feature of the interface is the real-time visualization of the KaibanJS workflow. Users can monitor:

- The current status of each agent
- Task execution progress
- Any errors or issues that arise during migration
- The final output ready to be added to the Astro blog content folder

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

The import page serves as the main entry point for the migration process. Here, we pass the frontmatter schema defined in `content.config.ts` to the ImportForm component. This schema ensures that all migrated content follows Astro's content structure requirements.

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

Now that our system is up and running, let's walk through the actual migration process:

1. **Input the URL**: In the import interface, paste the URL of the blog post you want to migrate into the input field.
   ![Input the URL](/url-input.png)

2. **Start Migration**: Click the "Import Post" button to begin the process. The system will:

   - Initialize the KaibanJS workflow
   - Show real-time status updates of both agents
   - Display task progress and any potential issues

3. **Monitor the Process**: You can watch as the agents work:

   - The Content Fetcher agent retrieves and purifies the content
   - The Content Cleaner agent structures the content with proper frontmatter
   - The workflow status updates in real-time

4. **Review the Result**: Once the migration is complete, you'll see:
   ![Edit the content](/result-edit.png)
   - A preview of the migrated content
   - The complete Markdown file with proper frontmatter
   - Options to:
     - Edit the content directly in the interface
     - Copy the entire Markdown to clipboard
     - Download the file as `.md` for your Astro content folder

The migrated content will maintain:

- The original article's structure and formatting
- All images and media content
- Proper Markdown syntax
- Astro-compatible frontmatter
  ![Migration Result Preview](/result-preview.png)

The system is now ready to handle blog migrations. The AI agents will work together to fetch, process, and format content for your Astro blog, streamlining the migration process significantly.

![Migration Result Preview](/result-complete.png)

## Try It Yourself!

Want to experience the power of AI-driven blog migration? Check out our live demo and source code:

- 🚀 [Live Demo](https://astro-kaibanjs-migrator-demo.vercel.app/import) - Try the migration tool in action
- 📦 [GitHub Repository](https://github.com/anthonydevs17/astro-kaibanjs-migrator-demo) - Get the complete source code

Feel free to fork the repository, experiment with the code, and adapt it to your needs. Contributions and feedback are always welcome!

## Conclusion

The integration of agentic systems like KaibanJS into content migration workflows exemplifies the transformative power of AI in automating complex tasks. By leveraging specialized AI agents, developers can efficiently migrate content to modern frameworks like Astro, enhancing performance and reducing manual effort. As AI continues to evolve, its role in streamlining development processes becomes increasingly indispensable.
