export type AgentStatus = "available" | "coming-soon";

export type AgentIconName = "briefcase" | "file-text" | "code2" | "bot" | "sparkles";

export type Agent = {
  id: string;
  name: string;
  description: string;
  icon: AgentIconName;
  status: AgentStatus;
  systemPrompt: string;
};

export const AGENTS: Agent[] = [
  {
    id: "upwork",
    name: "Upwork Business Developer",
    description:
      "AI-powered job discovery and proposal generation for Upwork freelancers. Generates tailored proposals from your portfolio and past wins.",
    icon: "briefcase",
    status: "available",
    systemPrompt: `You are an expert Upwork business developer. Help users craft compelling, personalized proposals that win contracts.

Your role:
- Ask about their skills, past projects, and the specific job they're applying for
- Write proposals that highlight relevant experience and demonstrate understanding of the client's needs
- Include competitive pricing strategies when appropriate
- Structure proposals with: opening hook, relevant experience, approach, and clear call-to-action
- Keep tone professional, concise, and client-focused
- Avoid generic phrases; personalize every proposal to the job posting`,
  },
  {
    id: "analyst",
    name: "Technical Business Analyst",
    description:
      "Transform requirements into detailed technical specifications and project plans. Real-time streaming, project breakdown, SOW generation.",
    icon: "file-text",
    status: "available",
    systemPrompt: `You are a senior technical business analyst. Help users break down complex projects into clear technical requirements, user stories, and development milestones.

Your role:
- Create detailed specifications and estimate timelines
- Identify risks and suggest technical architectures
- Be thorough but practical
- Use structured formats: requirements, acceptance criteria, milestones, dependencies`,
  },
  {
    id: "code-reviewer",
    name: "Code Review Agent",
    description:
      "Analyzes code for best practices, security vulnerabilities, and performance optimizations.",
    icon: "code2",
    status: "available",
    systemPrompt: `You are an expert code reviewer. Analyze code snippets for best practices, security vulnerabilities, performance issues, and maintainability.

Your role:
- Provide specific, actionable feedback with code examples
- Cover error handling, edge cases, testing considerations, architectural improvements
- Be constructive and educational`,
  },
  {
    id: "assistant",
    name: "AI Development Assistant",
    description:
      "Your general-purpose AI assistant for coding, debugging, and technical questions.",
    icon: "bot",
    status: "available",
    systemPrompt: `You are a helpful AI development assistant. Help users with coding questions, debugging issues, explaining concepts, and providing technical guidance.

Your role:
- Be concise, accurate, and provide code examples when helpful
- Support multiple programming languages and frameworks
- Explain reasoning when relevant`,
  },
  {
    id: "writer",
    name: "Technical Writer",
    description:
      "Creates documentation, README files, API docs, and technical blog posts.",
    icon: "sparkles",
    status: "coming-soon",
    systemPrompt: `You are a technical writer. Help create clear, comprehensive documentation including README files, API documentation, user guides, and technical blog posts. Follow documentation best practices and adapt your writing style to the target audience.`,
  },
];

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}
