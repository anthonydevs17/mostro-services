import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface TavilySearchResponse {
  results: {
    title: string;
    url: string;
    content: string;
    score: number;
  }[];
  query: string;
  answer?: string;
}

export const webSearchTool = createTool({
  id: "web-search",
  description: "Search the web for real-time information about any topic",
  inputSchema: z.object({
    query: z.string().describe("The search query to look up on the web"),
    includeAnswer: z
      .boolean()
      .optional()
      .describe(
        "Whether to generate an AI-created answer based on search results"
      ),
    searchDepth: z
      .enum(["basic", "advanced"])
      .optional()
      .describe("Depth of search: basic (faster) or advanced (more thorough)"),
    maxResults: z
      .number()
      .optional()
      .describe("Maximum number of results to return (1-10)")
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        content: z.string(),
        score: z.number()
      })
    ),
    answer: z.string().optional(),
    query: z.string()
  }),
  execute: async ({ context }) => {
    return await performWebSearch(
      context.query,
      context.includeAnswer,
      context.searchDepth,
      context.maxResults
    );
  }
});

const performWebSearch = async (
  query: string,
  includeAnswer: boolean = true,
  searchDepth: "basic" | "advanced" = "basic",
  maxResults: number = 5
) => {
  if (!process.env.TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY environment variable is not set");
  }

  const apiKey = process.env.TAVILY_API_KEY;
  const url = "https://api.tavily.com/search";

  const requestBody = {
    query,
    search_depth: searchDepth,
    include_answer: includeAnswer,
    max_results: Math.min(Math.max(maxResults, 1), 10), // Ensure between 1-10
    api_key: apiKey
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Tavily search failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as TavilySearchResponse;

  return {
    results: data.results,
    answer: data.answer,
    query: data.query
  };
};
