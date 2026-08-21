"use client";

import { useState } from "react";
import { agentPrompt } from "@/data/docs";

interface AgentPromptCTAProps {
  /** Compact drops the surrounding heading, for use inside a docs chapter. */
  compact?: boolean;
}


async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Denied or unavailable — fall through to the selection copy.
  }

  try {
    const scratch = document.createElement("textarea");
    scratch.value = text;
    scratch.setAttribute("readonly", "");
    scratch.style.position = "fixed";
    scratch.style.top = "-1000px";
    document.body.appendChild(scratch);
    scratch.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(scratch);
    return ok;
  } catch {
    return false;
  }
}

/** If copying is refused outright, at least make the prompt one gesture from selected. */
function selectAll(event: React.MouseEvent<HTMLPreElement>) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(event.currentTarget);
  selection.removeAllRanges();
  selection.addRange(range);
}

export default function AgentPromptCTA({ compact = false }: AgentPromptCTAProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copied = status === "copied";

  /**
   * The async clipboard API is unavailable on insecure origins and can be denied by
   * permission, in which case the promise rejects and the button would otherwise do
   * nothing at all. Fall back to a selection copy, and say so if even that fails.
   */
  const handleCopy = async () => {
    const ok = await writeToClipboard(agentPrompt);
    setStatus(ok ? "copied" : "failed");
    setTimeout(() => setStatus("idle"), ok ? 1800 : 2600);
  };

  return (
    <div style={{ width: "100%" }}>
      {!compact && (
        <>
          <h2 style={{ margin: "0 0 10px", fontSize: "36px", letterSpacing: "-0.03em", fontWeight: 700 }}>
            Hand it to your agent.
          </h2>
          <p style={{ margin: "0 0 28px", fontSize: "16.5px", color: "#55534C", maxWidth: "62ch" }}>
            One paste. It installs skelly, finds the hand-written skeletons already in your
            codebase, replaces them, and deletes what it replaced.
          </p>
        </>
      )}

      <div style={{
        border: "1px solid rgba(28,28,26,.12)",
        borderRadius: "14px",
        background: "#fff",
        overflow: "hidden"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(28,28,26,.09)",
          background: "#FAFAF8"
        }}>
          <span style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12.5px",
            color: "#8A8880",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            prompt — paste into Claude Code, Cursor, or any agent
          </span>

          <button
            onClick={handleCopy}
            aria-label="Copy the agent prompt to your clipboard"
            style={{
              flex: "none",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12.5px",
              fontWeight: 600,
              color: copied ? "#1F8A5B" : "#E8E6E0",
              background: copied ? "rgba(31,138,91,.1)" : "#1C1C1A",
              border: copied ? "1px solid rgba(31,138,91,.3)" : "1px solid #1C1C1A",
              padding: "7px 14px",
              borderRadius: "8px",
              transition: "all .18s"
            }}
          >
            {status === "copied" ? "copied!" : status === "failed" ? "press ⌘C" : "copy prompt"}
          </button>
        </div>

        <pre
          onClick={selectAll}
          style={{
          cursor: "text",
          margin: 0,
          padding: "18px 20px",
          maxHeight: "340px",
          overflow: "auto",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "12.5px",
          lineHeight: 1.7,
          color: "#3A3833",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}>
          {agentPrompt}
        </pre>
      </div>

      {!compact && (
        <p style={{
          margin: "16px 0 0",
          fontSize: "14px",
          color: "#8A8880",
          fontFamily: "var(--font-jetbrains-mono), monospace"
        }}>
          Agent already browsing? Point it at{" "}
          <a href="/llms.txt" style={{ color: "#4F46E5" }}>useskelly.dev/llms.txt</a>
          {" "}— the whole API in one fetch.
        </p>
      )}
    </div>
  );
}
