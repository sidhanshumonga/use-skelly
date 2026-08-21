import * as fs from "fs";
import * as path from "path";
import { PRESETS, SkellySpec, PresetName } from "./index";

export interface SnapshotOptions {
  out?: string;
  /** A spec compiled in the browser via `measureLayout()`. Written verbatim when given. */
  spec?: SkellySpec[];
  /** Which built-in preset to fall back to. Inferred from the route when omitted. */
  preset?: PresetName;
}

function inferPreset(route: string): PresetName {
  const lower = route.toLowerCase();
  if (lower.includes("dashboard")) return "dashboard";
  if (lower.includes("article") || lower.includes("blog") || lower.includes("post")) return "article";
  if (lower.includes("feed")) return "feed";
  if (lower.includes("profile") || lower.includes("account")) return "profile";
  return "generic";
}

/**
 * Build-time Snapshot generator: snapshot('/dashboard', { out: '.skelly/specs.json' })
 * Writes compiled route layouts to local spec files for server inlining.
 *
 * Without a `spec`, this writes the matching built-in preset — it does not run a browser,
 * so it cannot measure your real markup. Pass `spec` from `measureLayout()` for that.
 */
export async function snapshot(route: string, options: SnapshotOptions = {}) {
  const outFile = options.out || ".skelly/specs.json";
  const targetPath = path.resolve(process.cwd(), outFile);

  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let specs: Record<string, SkellySpec[]> = {};
  if (fs.existsSync(targetPath)) {
    try {
      specs = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
    } catch (e) {
      specs = {};
    }
  }

  const preset = options.preset || inferPreset(route);
  const routeSpec = options.spec || PRESETS[preset] || PRESETS.generic;

  specs[route] = routeSpec;

  fs.writeFileSync(targetPath, JSON.stringify(specs, null, 2), "utf-8");
  console.log(
    `[skelly/build] Generated layout snapshot for route "${route}" (${options.spec ? "measured" : `preset: ${preset}`}) saved in "${outFile}"`
  );
}
