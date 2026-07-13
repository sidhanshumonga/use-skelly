# Contributing to use-skelly

First off, thank you for checking out `use-skelly`! We are thrilled to welcome your contributions. 

This document outlines the branching strategy, local environment configuration, and submission guidelines for contributing to this project.

---

## 🌿 Branching Strategy

To keep releases stable, we maintain a multi-branch repository structure:

* **`main`**: Represents production-ready code. All packages published on npm align directly with this branch.
* **`dev`**: The active staging branch. Features and bug fixes should target `dev` first. It undergoes QA checks before merging into `main`.
* **Topic Branches**: All contributors should create a branch for their changes. Use these prefixes:
  * `feature/` for new adapters, layouts, features (e.g., `feature/angular-adapter`)
  * `bugfix/` for bug reports and logic fixes (e.g., `bugfix/svg-measuring-shift`)
  * `docs/` for tutorials, corrections, or articles (e.g., `docs/next-js-streaming-guide`)

---

## 🛠️ Local Development Setup

Follow these steps to run the monorepo locally:

### 1. Prerequisites
Ensure you have **Node.js v18.0.0+** and **npm v9+** installed.

### 2. Clone and Install Dependencies
Clone the repository and run `npm install` at the root folder:

```bash
git clone https://github.com/sidhanshumonga/use-skelly.git
cd use-skelly
npm install
```

### 3. Start Development Servers
This starts the documentation site locally for hot-reload previews:

```bash
npm run dev
```

### 4. Build and Compile Packages
Before proposing changes, compile the typescript core modules to ensure there are no syntax or type compiler errors:

```bash
npm run build
```

---

## 📝 Pull Request Guidelines

Before submitting your PR to the **`dev`** branch:

1. **Keep it Small**: Focus each PR on solving a single problem.
2. **Run Lint Checks**: Ensure code meets syntax and code quality style rules:
   ```bash
   npm run lint
   ```
3. **Verify Builds**: Run `npm run build` locally to confirm the TypeScript compiler and Next.js static layouts compile cleanly.
4. **Update Docs**: If you are adding a feature or changing a behavior, update the relevant pages in the `src/data/docs.ts` content.

---

## 💬 Code of Conduct

We are dedicated to providing a welcoming, diverse, and safe community for everyone. Be respectful, construct feedback constructively, and collaborate with empathy.

Thank you for helping us make loading indicators feel instant and elegant!
