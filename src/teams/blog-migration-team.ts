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
