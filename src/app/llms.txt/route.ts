import * as fs from "fs";
import * as path from "path";
import { chapters, agentPrompt } from "@/data/docs";

export const dynamic = "force-static";

const SITE = "https://useskelly.dev";

/**
 * https://llmstxt.org — a single plain-text fetch that gives an agent the whole working
 * surface of the library, instead of making it scrape rendered pages.
 *
 * The API half is read from packages/skelly/AGENTS.md at build time, which is the same
 * file shipped inside the npm tarball. Editing that file updates both; there is no second
 * copy here to fall out of date.
 */
function readAgentGuide(): string {
  const guidePath = path.join(process.cwd(), "packages/skelly/AGENTS.md");
  return fs.readFileSync(guidePath, "utf-8").trim();
}

function docLinks(): string {
  const sections = new Map<string, string[]>();

  chapters.forEach(chapter => {
    const lines = sections.get(chapter.section) || [];
    lines.push(`- [${chapter.title}](${SITE}/docs/${chapter.slug}): ${chapter.intro}`);
    sections.set(chapter.section, lines);
  });

  return Array.from(sections.entries())
    .map(([section, lines]) => `## ${section}\n\n${lines.join("\n")}`)
    .join("\n\n");
}

function buildLlmsTxt(): string {
  return `${readAgentGuide()}

---

${docLinks()}

## Prompt for coding agents

${agentPrompt}
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
