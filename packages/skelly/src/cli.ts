#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

switch (command) {
  case "create":
    handleCreate();
    break;
  case "init":
    handleInit();
    break;
  default:
    console.error(`[skelly] Unknown command: "${command}"`);
    printHelp();
    process.exit(1);
}

function printHelp() {
  console.log(`
Skelly CLI — Bootstrap & scaffold layout-driven skeletons.

Usage:
  npx skelly <command> [options]

Commands:
  create <project-name> [options]   Bootstrap a new Next.js or Vite React project pre-configured with Skelly.
  init                              Integrate Skelly into an existing React or Next.js project.

Options for "create":
  --next                            Initialize with Next.js App Router (default)
  --vite                            Initialize with Vite (React + TypeScript)
  --yes, -y                         Skip confirmation prompts

Examples:
  npx skelly create my-loading-app --next
  npx skelly init
  `);
}

function handleCreate() {
  const projectName = args[1];
  if (!projectName) {
    console.error("[skelly] Error: Please specify a project name.");
    console.log("Example: npx skelly create my-awesome-app");
    process.exit(1);
  }

  const isVite = args.includes("--vite");
  const framework = isVite ? "Vite (React + TS)" : "Next.js (App Router)";

  console.log(`[skelly] Bootstrapping a new ${framework} project: "${projectName}"...`);

  try {
    if (isVite) {
      // Run Vite bootstrap
      console.log(`[skelly] Running npm create vite@latest...`);
      execSync(`npm create vite@latest ${projectName} -- --template react-ts`, { stdio: "inherit" });
      
      const projectPath = path.resolve(process.cwd(), projectName);
      
      // Install dependencies
      console.log(`[skelly] Installing dependencies in "${projectName}"...`);
      execSync(`npm install`, { cwd: projectPath, stdio: "inherit" });
      execSync(`npm install skelly-js`, { cwd: projectPath, stdio: "inherit" });

      // Ingest Skelly style sheets in src/main.tsx
      const mainPath = path.join(projectPath, "src", "main.tsx");
      if (fs.existsSync(mainPath)) {
        let content = fs.readFileSync(mainPath, "utf-8");
        content = `import 'skelly-js/style.css';\n` + content;
        fs.writeFileSync(mainPath, content, "utf-8");
        console.log(`[skelly] Injected style.css into "src/main.tsx"`);
      }
    } else {
      // Run Next.js bootstrap
      console.log(`[skelly] Running npx create-next-app@latest...`);
      execSync(
        `npx -y create-next-app@latest ${projectName} --ts --src-dir --app --import-alias "@/*" --use-npm --yes`,
        { stdio: "inherit" }
      );

      const projectPath = path.resolve(process.cwd(), projectName);

      // Install Skelly
      console.log(`[skelly] Installing skelly-js package in "${projectName}"...`);
      execSync(`npm install skelly-js`, { cwd: projectPath, stdio: "inherit" });

      // Add Skelly styles to src/app/layout.tsx
      const layoutPath = path.join(projectPath, "src", "app", "layout.tsx");
      if (fs.existsSync(layoutPath)) {
        let content = fs.readFileSync(layoutPath, "utf-8");
        content = `import "skelly-js/style.css";\n` + content;
        fs.writeFileSync(layoutPath, content, "utf-8");
        console.log(`[skelly] Injected style.css into "src/app/layout.tsx"`);
      }

      // Add global route loading.tsx template
      const loadingPath = path.join(projectPath, "src", "app", "loading.tsx");
      const loadingCode = `import { Skelly } from "skelly-js/react";

export default function GlobalLoading() {
  // Pre-baked generic skeleton loaded instantly for every route transition!
  return <Skelly preset="generic" visual="shimmer" style={{ padding: "40px", maxWidth: "600px" }} />;
}
`;
      fs.writeFileSync(loadingPath, loadingCode, "utf-8");
      console.log(`[skelly] Created default page-loader fallback "src/app/loading.tsx"`);
    }

    console.log(`
=========================================
🎉 Project "${projectName}" scaffolded successfully!
=========================================
Next steps:
  cd ${projectName}
  npm run dev
    `);
  } catch (error: any) {
    console.error(`[skelly] Creation failed: ${error.message}`);
    process.exit(1);
  }
}

function handleInit() {
  console.log("[skelly] Integrating Skelly into existing project...");
  const packageJsonPath = path.resolve(process.cwd(), "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error("[skelly] Error: Could not find package.json in the current folder. Run this command inside your project root.");
    process.exit(1);
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const isNext = !!(pkg.dependencies && pkg.dependencies.next);

    // Auto-detect package manager
    let installCmd = "npm install skelly-js";
    if (fs.existsSync(path.resolve(process.cwd(), "pnpm-lock.yaml"))) {
      installCmd = "pnpm add skelly-js";
    } else if (fs.existsSync(path.resolve(process.cwd(), "yarn.lock"))) {
      installCmd = "yarn add skelly-js";
    } else if (fs.existsSync(path.resolve(process.cwd(), "bun.lockb"))) {
      installCmd = "bun add skelly-js";
    }

    console.log(`[skelly] Installing package using: "${installCmd}"...`);
    execSync(installCmd, { stdio: "inherit" });

    if (isNext) {
      console.log("[skelly] Next.js project detected.");
      // Look for src/app/layout.tsx or app/layout.tsx
      let layoutPath = "";
      if (fs.existsSync(path.resolve(process.cwd(), "src/app/layout.tsx"))) {
        layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx");
      } else if (fs.existsSync(path.resolve(process.cwd(), "app/layout.tsx"))) {
        layoutPath = path.resolve(process.cwd(), "app/layout.tsx");
      }

      if (layoutPath) {
        let content = fs.readFileSync(layoutPath, "utf-8");
        if (!content.includes("skelly-js/style.css")) {
          content = `import "skelly-js/style.css";\n` + content;
          fs.writeFileSync(layoutPath, content, "utf-8");
          console.log(`[skelly] Added style.css import in "${path.basename(layoutPath)}"`);
        }
      }

      // Add a loading.tsx template if it doesn't exist
      const appDir = layoutPath ? path.dirname(layoutPath) : "";
      if (appDir) {
        const loadingPath = path.join(appDir, "loading.tsx");
        if (!fs.existsSync(loadingPath)) {
          const loadingCode = `import { Skelly } from "skelly-js/react";

export default function GlobalLoading() {
  return <Skelly preset="generic" visual="shimmer" style={{ padding: "40px", maxWidth: "600px" }} />;
}
`;
          fs.writeFileSync(loadingPath, loadingCode, "utf-8");
          console.log(`[skelly] Created "loading.tsx" in "${path.relative(process.cwd(), loadingPath)}"`);
        }
      }
    } else {
      console.log("[skelly] Standard React project detected.");
      // Search for src/main.tsx, src/index.tsx, src/main.js, src/index.js
      let entryPath = "";
      const candidates = [
        "src/main.tsx",
        "src/index.tsx",
        "src/main.jsx",
        "src/index.jsx",
        "src/main.js",
        "src/index.js"
      ];
      for (const cand of candidates) {
        const full = path.resolve(process.cwd(), cand);
        if (fs.existsSync(full)) {
          entryPath = full;
          break;
        }
      }

      if (entryPath) {
        let content = fs.readFileSync(entryPath, "utf-8");
        if (!content.includes("skelly-js/style.css")) {
          content = `import 'skelly-js/style.css';\n` + content;
          fs.writeFileSync(entryPath, content, "utf-8");
          console.log(`[skelly] Added style.css import in "${path.relative(process.cwd(), entryPath)}"`);
        }
      }
    }

    console.log(`
🎉 Integration complete! Skelly is ready to use in your project.
Import components using:
  import { Skelly } from 'skelly-js/react'
    `);
  } catch (error: any) {
    console.error(`[skelly] Integration failed: ${error.message}`);
    process.exit(1);
  }
}
