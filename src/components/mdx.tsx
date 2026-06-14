import defaultComponents from "fumadocs-ui/mdx";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Card, Cards } from "fumadocs-ui/components/card";
import type { MDXComponents } from "mdx/types";
import { CopyChip } from "@/components/ui";

/** MDX component map for docs pages. Reuses the landing page's <CopyChip>. */
export function getMDXComponents(extra?: MDXComponents): MDXComponents {
  // Cast bridges the fumadocs-ui/mdx default component types and `mdx/types`
  // (a minor version skew makes the `error` key non-assignable otherwise).
  return {
    ...defaultComponents,
    Callout,
    Tab,
    Tabs,
    Step,
    Steps,
    Card,
    Cards,
    CopyChip,
    ...extra,
  } as MDXComponents;
}
