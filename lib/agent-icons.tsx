"use client";

import { Briefcase, FileText, Code2, Bot, Sparkles, type LucideIcon } from "lucide-react";
import type { AgentIconName } from "./agents";

export const AGENT_ICONS: Record<AgentIconName, LucideIcon> = {
  briefcase: Briefcase,
  "file-text": FileText,
  code2: Code2,
  bot: Bot,
  sparkles: Sparkles,
};
