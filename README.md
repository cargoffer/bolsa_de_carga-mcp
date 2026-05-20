# Bolsa de Carga MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Version](https://img.shields.io/badge/MCP-1.0.0-blue)](https://modelcontextprotocol.io)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![GitHub Release](https://img.shields.io/github/v/release/cargoffer/bolsa_de_carga-mcp)](https://github.com/cargoffer/bolsa_de_carga-mcp/releases)

Model Context Protocol server for **Cargoffer Bolsa de Carga** (freight marketplace) API — enables AI agents and LLMs to interact with the Cargoffer freight marketplace.

## What is this?

This MCP server exposes the Cargoffer Bolsa de Carga API as tools for AI agents using the [Model Context Protocol](https://modelcontextprotocol.io). It provides:

- **35+ tools** for auctions, addresses, truckers, vehicles, deliveries
- **JSON-RPC 2.0** interface
- **Standalone** (no dependencies beyond Node.js)
- **Production-ready** with https://api.pro.cargoffer.com

## Use Cases

- AI agents searching freight loads (auctions) between cities
- Creating and managing freight auctions
- Accepting bids and closing deals
- Managing company addresses, trucks, trailers, vehicles
- Tracking deliveries and generating CMR waybills
- Integrating with Claude Desktop, OpenAI GPTs, or any LLM

## Features

### Auctions (11 tools)
- List active auctions
- Get/Create/Update/Delete auctions
- Publish auction
- Accept bid
- Sign with CMR
- Favorites management

### Addresses (4 tools)
- List/Create/Update/Delete addresses

### Trailers/Truckers (4 tools)
- List/Create/Update/Delete trailers

### Vehicles (4 tools)
- List/Create/Update/Delete vehicles

### Delivery (6 tools)
- List deliveries
- Get delivery details
- Download CMR PDF
- Send delivery messages

### Auth (2 tools)
- Login
- Register

## Quick Start

```bash
# Clone
git clone https://github.com/cargoffer/bolsa_de_carga-mcp.git
cd bolsa_de_carga-mcp

# Configure with your API key
export API_KEY="your-api-key"

# Run
node src/server.js
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_KEY` | Cargoffer API key (required for production) | - |
| `API_URL` | API base URL | https://api.pro.cargoffer.com |
| `PORT` | Server port | 3000 |

### Local Development

```bash
# Use local backend
API_URL=http://localhost:8090 API_KEY=your-key node src/server.js

# Or copy .env.example
cp .env.example .env
# Edit .env with your values
node src/server.js
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/tools` | GET | List available tools |
| `/` | POST | JSON-RPC 2.0 endpoint |

## Example Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "bolsa_auctions_active",
  "params": { "limit": 10 }
}
```

## Example Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "status": 200,
    "data": {
      "docs": [
        {
          "serviceCode": "MADBCNnT4FN",
          "from": { "city": "Madrid", "country": "ES" },
          "to": { "city": "Barcelona", "country": "ES" },
          "goods": { "description": "General cargo", "weight": 1000 },
          "status": "active"
        }
      ]
    }
  }
}
```

## Integration Examples

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bolsa-de-carga": {
      "command": "node",
      "args": ["/path/to/bolsa_de_carga-mcp/src/server.js"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

### OpenAI GPTs

Use as a custom GPT action with the JSON-RPC interface.

### Direct HTTP

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "bolsa_auctions_active",
    "params": {"limit": 10}
  }'
```

## Getting an API Key

Contact Cargoffer to get an API key for production use:
- Email: cto@cargoffer.com
- Or request through your Cargoffer dashboard

## License

MIT License - See LICENSE file for details

## GitHub

- Repository: https://github.com/cargoffer/bolsa_de_carga-mcp
- Issues: https://github.com/cargoffer/bolsa_de_carga-mcp/issues