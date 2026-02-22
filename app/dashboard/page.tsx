import AgentCard from "@/components/AgentCard";
import { AGENTS } from "@/lib/agents";

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Welcome to <span className="text-gradient">My Dev Agents</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Select an AI agent to help you build, analyze, and grow your projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {AGENTS.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center text-muted-foreground animate-fade-in">
          <p className="text-sm">More agents coming soon. Stay tuned for updates!</p>
        </div>
      </div>
    </div>
  );
}
