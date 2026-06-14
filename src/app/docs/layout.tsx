import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "@/lib/source";

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      githubUrl="https://github.com/Rakshan001/Baton-Multi-Agent-"
      nav={{
        title: (
          <span className="docs-wordmark">
            <span className="docs-glyph" aria-hidden="true" />
            baton
          </span>
        ),
        url: "/",
      }}
      links={[{ text: "Home", url: "/" }]}
    >
      {children}
    </DocsLayout>
  );
}
