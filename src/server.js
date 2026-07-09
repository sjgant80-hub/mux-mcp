#!/usr/bin/env node
/**
 * mux-mcp · MCP server for Mux
 * Auto-generated wrapping 0 tools from OpenAPI.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Mux } from '@ai-native-solutions/mux-sdk';

const TOOLS = [];

const server = new Server({ name: 'mux-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

const client = new Mux({ apiKey: process.env.MUX_API_KEY });

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const method = req.params.name.replace('mux_', '');
  if (typeof client[method] !== 'function') throw new Error('unknown tool: ' + req.params.name);
  const result = await client[method](req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

await server.connect(new StdioServerTransport());
console.error('mux-mcp v1.0.0 · 0 tools ready');
