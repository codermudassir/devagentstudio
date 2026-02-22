import { notFound } from "next/navigation";
import { getAgentById } from "@/lib/agents";
import ChatInterface from "@/components/ChatInterface";

interface ChatPageProps {
  params: Promise<{ agentId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { agentId } = await params;
  const agent = getAgentById(agentId);

  if (!agent || agent.status !== "available") {
    notFound();
  }

  return <ChatInterface agent={agent} />;
}
