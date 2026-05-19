# Bolsa de Carga MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Version](https://img.shields.io/badge/MCP-1.0.0-blue)](https://modelcontextprotocol.io)

Model Context Protocol server for **Cargoffer Bolsa de Carga** (freight marketplace) API — enables AI agents and LLMs to interact with the Cargoffer freight marketplace.

## What is this?

This MCP server exposes the Cargoffer Bolsa de Carga API as tools for AI agents using the [Model Context Protocol](https://modelcontextprotocol.io). It provides:

- **35+ tools** for auctions, addresses, truckers, vehicles, deliveries
- **JSON-RPC 2.0** interface
- **Standalone** (no dependencies beyond Node.js)

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

### Truckers (4 tools)
- List/Create/Update/Delete truckers

### Vehicles (4 tools)
- List/Create/Update/Delete vehicles

### Delivery (3 tools)
- List active deliveries
- Get delivery details
- Download CMR

### Auth (2 tools)
- Login
- Register

## Usage

### Quick Start

```bash
# Install
git clone https://github.com/cargoffer/bolsa_de_carga-mcp.git
cd bolsa_de_carga-mcp

# Configure
export API_KEY="your-api-key"

# Run
node src/server.js
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_KEY` | Cargoffer API key | - |
| `API_URL` | API base URL | https://api.cargoffer.com |
| `PORT` | Server port | 3000 |

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/tools` | GET | List available tools |
| `/` | POST | JSON-RPC endpoint |

### Example Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "bolsa_auctions_active",
  "params": { "limit": 10 }
}
```

### Example Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "serviceCode": "MADBCNnT4FN",
      "from": { "city": "Madrid", "country": "ES" },
      "to": { "city": "Barcelona", "country": "ES" },
      "goods": { "description": "General cargo", "weight": 1000 },
      "status": "active"
    }
  ]
}
```

## Integration with Claude Desktop

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

## Keywords (for AI/LLM discovery)

```
bolsa de carga, freight marketplace, freight, shipping, logistics, transportation,
mcp, model context protocol, mcp server, ai agents, llm tools,
cargoffer, truck brokerage, load board, freight matching,
auction, bid, contract, delivery, CMR, eCMR
```

## License

MIT License - See LICENSE file for details