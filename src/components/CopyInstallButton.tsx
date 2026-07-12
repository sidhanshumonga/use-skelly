"use client";

import { useState } from "react";

interface CopyInstallButtonProps {
  command: string;
  variant?: "light" | "dark";
}

export default function CopyInstallButton({ command, variant = "light" }: CopyInstallButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  const isDark = variant === "dark";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      fontFamily: "var(--font-jetbrains-mono), monospace",
      fontSize: isDark ? "15px" : "14.5px",
      background: isDark ? "rgba(255, 255, 255, 0.07)" : "#1C1C1A",
      border: isDark ? "1px solid rgba(255, 255, 255, 0.14)" : "none",
      color: "#E8E6E0",
      padding: isDark ? "14px 22px" : "13px 18px",
      borderRadius: "10px",
      boxShadow: isDark ? "none" : "0 4px 16px rgba(28,28,26,.14)"
    }}>
      <span style={{ color: "#8A8880", userSelect: "none" }}>$</span>
      <span>{command}</span>
      <button
        onClick={handleCopy}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#8A8880",
          fontFamily: "inherit",
          fontSize: "12px",
          padding: "2px 6px",
          borderRadius: "5px",
          transition: "all 0.2s"
        }}
        className="hover-bright"
      >
        {copied ? "copied!" : "copy"}
      </button>
    </div>
  );
}
