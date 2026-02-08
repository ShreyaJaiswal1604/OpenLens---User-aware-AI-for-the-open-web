#!/usr/bin/env node
/**
 * Example MCP-compatible tool server for AgentLens.
 * Run: node mcp-servers/weather-server.js
 * Listens on http://localhost:3001
 *
 * Exposes tools:
 *   - get_weather: Get current weather for a city
 *   - get_forecast: Get 3-day forecast for a city
 */

const http = require('http');

// Mock weather data
const WEATHER_DATA = {
  'new york': { temp: 42, condition: 'Cloudy', humidity: 65, wind: '12 mph NW' },
  'london': { temp: 48, condition: 'Rainy', humidity: 82, wind: '8 mph SW' },
  'tokyo': { temp: 55, condition: 'Sunny', humidity: 45, wind: '5 mph E' },
  'paris': { temp: 50, condition: 'Partly cloudy', humidity: 60, wind: '10 mph W' },
  'mumbai': { temp: 85, condition: 'Humid', humidity: 78, wind: '6 mph S' },
  'san francisco': { temp: 58, condition: 'Foggy', humidity: 75, wind: '15 mph W' },
};

const TOOLS = [
  {
    name: 'get_weather',
    description: 'Get current weather for a city',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name (e.g. "New York", "London")' },
      },
      required: ['city'],
    },
  },
  {
    name: 'get_forecast',
    description: 'Get a 3-day weather forecast for a city',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name' },
      },
      required: ['city'],
    },
  },
];

function handleToolCall(name, args) {
  const city = (args.city || '').toLowerCase();
  const weather = WEATHER_DATA[city];

  if (name === 'get_weather') {
    if (!weather) {
      return { content: [{ type: 'text', text: `Weather data not available for "${args.city}". Available cities: ${Object.keys(WEATHER_DATA).join(', ')}` }] };
    }
    return {
      content: [{
        type: 'text',
        text: `Weather in ${args.city}: ${weather.temp}°F, ${weather.condition}. Humidity: ${weather.humidity}%, Wind: ${weather.wind}`,
      }],
    };
  }

  if (name === 'get_forecast') {
    if (!weather) {
      return { content: [{ type: 'text', text: `Forecast not available for "${args.city}". Available cities: ${Object.keys(WEATHER_DATA).join(', ')}` }] };
    }
    const days = ['Tomorrow', 'Day after', 'In 3 days'];
    const forecast = days.map((d, i) => {
      const tempDelta = Math.round((Math.random() - 0.5) * 10);
      return `${d}: ${weather.temp + tempDelta}°F, ${['Sunny', 'Cloudy', 'Rainy', 'Partly cloudy'][i % 4]}`;
    }).join('\n');
    return { content: [{ type: 'text', text: `3-day forecast for ${args.city}:\n${forecast}` }] };
  }

  return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    try {
      const request = JSON.parse(body);
      const { method, params, id } = request;

      let result;

      switch (method) {
        case 'initialize':
          result = {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'weather-server', version: '1.0.0' },
          };
          break;

        case 'tools/list':
          result = { tools: TOOLS };
          break;

        case 'tools/call':
          result = handleToolCall(params.name, params.arguments || {});
          break;

        default:
          result = { error: `Unknown method: ${method}` };
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', id: id || 1, result }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } }));
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🌤️  Weather MCP server running at http://localhost:${PORT}`);
  console.log('Tools available: get_weather, get_forecast');
  console.log('Available cities: ' + Object.keys(WEATHER_DATA).join(', '));
});
