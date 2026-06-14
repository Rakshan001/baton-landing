import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// Static search index over the docs (Cmd/Ctrl+K, wired by RootProvider).
export const { GET } = createFromSource(source);
