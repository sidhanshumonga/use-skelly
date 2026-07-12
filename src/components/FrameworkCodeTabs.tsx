"use client";

import { useState } from "react";

export default function FrameworkCodeTabs() {
  const [activeTab, setActiveTab] = useState<"react" | "vue" | "svelte" | "vanilla">("react");

  const codeSamples = {
    react: `import { Skelly } from 'use-skelly/react'

<Skelly loading={isLoading} visual="shimmer">
  <ProfileCard user={user} />
</Skelly>`,
    vue: `<script setup>
import { Skelly } from 'use-skelly/vue'
</script>

<Skelly :loading="isLoading" visual="shimmer">
  <ProfileCard :user={user} />
</Skelly>`,
    svelte: `<script>
  import { Skelly } from 'use-skelly/svelte'
</script>

<Skelly loading={isLoading} visual="shimmer">
  <ProfileCard {user} />
</Skelly>`,
    vanilla: `import { skelly } from 'use-skelly'

const release = skelly(document.querySelector('#card'), {
  visual: 'shimmer'
})

await fetchData()
release()`
  };

  const frameworks = [
    { id: "react", label: "React" },
    { id: "vue", label: "Vue" },
    { id: "svelte", label: "Svelte" },
    { id: "vanilla", label: "Vanilla" }
  ] as const;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        {frameworks.map((fw) => {
          const active = activeTab === fw.id;
          return (
            <button
              key={fw.id}
              onClick={() => setActiveTab(fw.id)}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "13px",
                padding: "9px 18px",
                borderRadius: "99px 99px 0 0", // slightly modern tab style
                border: "1px solid rgba(28, 28, 26, 0.12)",
                borderBottom: "none",
                cursor: "pointer",
                background: active ? "#1C1C1A" : "#F5F4F0",
                color: active ? "#fff" : "#55534C",
                transition: "all 0.15s ease"
              }}
            >
              {fw.label}
            </button>
          );
        })}
      </div>
      <pre style={{
        margin: 0,
        background: "#1C1C1A",
        color: "#E8E6E0",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "14px",
        lineHeight: 1.75,
        padding: "26px 30px",
        borderRadius: "0 12px 12px 12px",
        overflowX: "auto",
        boxShadow: "0 8px 28px rgba(28,28,26,.12)",
        minHeight: "170px"
      }}>{codeSamples[activeTab]}</pre>
    </div>
  );
}
