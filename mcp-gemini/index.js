#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { GoogleGenAI } from "@google/genai";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load GEMINI_API_KEY from a local, gitignored .env file if present.
// Anything already in process.env (e.g. passed via the MCP config) wins.
const envFile = join(__dirname, ".env");
if (existsSync(envFile)) {
  try {
    process.loadEnvFile(envFile);
  } catch {
    // ignore malformed env file; we validate the key below
  }
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "mcp-gemini: missing GEMINI_API_KEY. Put it in mcp-gemini/.env " +
      "(GEMINI_API_KEY=...) or pass it via the MCP server env config."
  );
  process.exit(1);
}

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const ai = new GoogleGenAI({ apiKey });

const server = new McpServer({
  name: "gemini",
  version: "1.0.0",
});

server.registerTool(
  "ask_gemini",
  {
    title: "Ask Gemini",
    description:
      "Send a prompt to a Google Gemini model and return its text response. " +
      "Useful for a second opinion, drafting, or offloading a self-contained task.",
    inputSchema: {
      prompt: z.string().describe("The prompt / question to send to Gemini."),
      model: z
        .string()
        .optional()
        .describe(`Gemini model id. Defaults to ${DEFAULT_MODEL}.`),
      system: z
        .string()
        .optional()
        .describe("Optional system instruction to steer the model."),
    },
  },
  async ({ prompt, model, system }) => {
    try {
      const response = await ai.models.generateContent({
        model: model || DEFAULT_MODEL,
        contents: prompt,
        ...(system
          ? { config: { systemInstruction: system } }
          : {}),
      });
      const text = response.text ?? "(no text returned)";
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        isError: true,
        content: [
          { type: "text", text: `Gemini request failed: ${err?.message || err}` },
        ],
      };
    }
  }
);

server.registerTool(
  "list_gemini_models",
  {
    title: "List Gemini models",
    description: "List Gemini models available to this API key.",
    inputSchema: {},
  },
  async () => {
    try {
      const names = [];
      const pager = await ai.models.list();
      for await (const m of pager) {
        names.push(m.name);
      }
      return {
        content: [
          { type: "text", text: names.join("\n") || "(no models returned)" },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          { type: "text", text: `Listing models failed: ${err?.message || err}` },
        ],
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("mcp-gemini: server ready");
