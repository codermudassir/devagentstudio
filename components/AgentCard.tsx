"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Agent } from "@/lib/agents";
import { AGENT_ICONS } from "@/lib/agent-icons";

interface AgentCardProps {
  agent: Agent;
  index?: number;
}

export default function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const isAvailable = agent.status === "available";
  const Icon = AGENT_ICONS[agent.icon];

  const content = (
    <div
      className={`card-agent group ${
        isAvailable ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            isAvailable
              ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            isAvailable ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
          }`}
        >
          {isAvailable ? "Available" : "Coming Soon"}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{agent.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{agent.description}</p>

      {isAvailable && (
        <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
          <span>Try now</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  if (isAvailable) {
    return (
      <Link href={`/dashboard/chat/${agent.id}`} className="block animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
        {content}
      </Link>
    );
  }

  return (
    <div className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      {content}
    </div>
  );
}
