# Operational MCP layer for European freight marketplace operations

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Version](https://img.shields.io/badge/MCP-1.0.0-blue)](https://modelcontextprotocol.io)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![GitHub Release](https://img.shields.io/github/v/release/cargoffer/bolsa_de_carga-mcp)](https://github.com/cargoffer/bolsa_de_carga-mcp/releases)

**A freight marketplace MCP server** that connects AI agents (Claude Desktop, Cursor, Cline, Continue, etc.) to the Cargoffer Bolsa de Carga freight marketplace API — enabling LLMs to search loads, manage auctions, bid on freight, track deliveries, and generate CMR waybills entirely through natural language.

> **What problem does it solve?** Freight brokers and carriers spend hours refreshing **load board** websites, copying data between tabs, and manually posting auction updates. This MCP server turns the entire Cargoffer freight marketplace into callable AI tools — an agent can search available loads, create auctions, accept bids, register trucks, and generate legal documents in one conversational flow.
>
> **What makes it different?** Unlike screen-scraped load boards or single-purpose APIs, this exposes the full marketplace lifecycle as structured MCP tools: auctions (11 tools), addresses (4), trailers/truckers (4), vehicles (4), deliveries (6), and auth (2). The AI agent doesn't just read data — it can transact: publish auctions, accept bids, generate CMR PDFs. It's a read-write operations layer, not a read-only dashboard.
>
> **What integration does it enable?** Any MCP-compatible client can invoke 35+ **freight marketplace** tools to search freight loads, manage company resources, participate in auctions, and generate shipping documents — all through natural language conversation with an LLM.
>
> **What does "easy integration" mean concretely?** Clone the repo, set `API_KEY=your-key`, run `node src/server.js`, and configure your MCP client with one JSON block. No SDK installation, no database setup, no OAuth dance. Your AI agent can immediately post and bid on European **load board** loads.

---

## Why this MCP exists

The European freight spot market runs through dozens of incompatible load boards, each with its own login, UI, and data format. Dispatchers manually check multiple boards, copy-paste load details into spreadsheets, and coordinate negotiations over WhatsApp and email. The process is slow, error-prone, and invisible to automation.

This MCP server exposes the Cargoffer Bolsa de Carga API — a unified **European road transport** freight marketplace — as first-class LLM tools. It lets AI agents search available loads, create and publish auctions, manage bids, register company vehicles and drivers, track delivery status, and generate CMR waybills. It transforms an AI assistant from a chat interface into an operational freight desk capable of **logistics document automation** and marketplace transactions.

---

## MCP Capabilities

- **35+ MCP tools** across 6 functional domains — auctions, addresses, trailers, vehicles, deliveries, auth
- **Full auction lifecycle** — create, publish, list, update, delete, accept bids, manage favorites
- **Address book management** — reusable company locations (pickup, delivery, depot)
- **Trailer/trucker registry** — manage fleet capacity and driver assignments
- **Vehicle management** — register trucks with dimensions, load capacity, and certifications
- **Delivery tracking** — list deliveries, get details, download CMR PDFs, send delivery messages
- **CMR waybill generation** — sign and lock freight contracts directly from delivery records
- **JWT-based auth** — server handles login tokens transparently
- **JSON-RPC 2.0** over HTTP — standard MCP transport
- **Zero runtime dependencies** beyond Node.js 18+ — no Docker, no database, no build step

---

## Tools

### Auctions (11 tools)

List active auctions, get/create/update/delete auctions, publish auction, accept bid, sign with CMR, manage favorites.

| Tool | Description |
|------|-------------|
| `bolsa_auctions_active` | List active freight auctions |
| `bolsa_auctions_get` | Get auction details by ID |
| `bolsa_auctions_create` | Create a new auction |
| `bolsa_auctions_update` | Update an existing auction |
| `bolsa_auctions_delete` | Delete an auction |
| `bolsa_auctions_publish` | Publish auction to marketplace |
| `bolsa_auctions_accept_bid` | Accept a bid on an auction |
| `bolsa_auctions_sign_cmr` | Sign CMR waybill for auction |
| `bolsa_auctions_favorites` | Manage favorite auctions |

### Addresses (4 tools)

| Tool | Description |
|------|-------------|
| `bolsa_addresses_list` | List all addresses |
| `bolsa_addresses_create` | Create a new address |
| `bolsa_addresses_update` | Update an address |
| `bolsa_addresses_delete` | Delete an address |

### Trailers / Truckers (4 tools)

| Tool | Description |
|------|-------------|
| `bolsa_trailers_list` | List all trailers |
| `bolsa_trailers_create` | Register new trailer |
| `bolsa_trailers_update` | Update trailer info |
| `bolsa_trailers_delete` | Remove a trailer |

### Vehicles (4 tools)

| Tool | Description |
|------|-------------|
| `bolsa_vehicles_list` | List all vehicles |
| `bolsa_vehicles_create` | Add a new vehicle |
| `bolsa_vehicles_update` | Update vehicle details |
| `bolsa_vehicles_delete` | Remove a vehicle |

### Deliveries (6 tools)

| Tool | Description |
|------|-------------|
| `bolsa_deliveries_list` | List all deliveries |
| `bolsa_deliveries_get` | Get delivery details |
| `bolsa_deliveries_download_cmr` | Download CMR PDF |
| `bolsa_deliveries_send_message` | Send delivery message |

### Auth (2 tools)

| Tool | Description |
|------|-------------|
| `bolsa_auth_login` | Authenticate and receive JWT token |
| `bolsa_auth_register` | Register a new account |

---

## Directory structure

```
bolsa_de_carga-mcp/
├── package.json            # Node.js 18+, ES module, bolsa-de-carga-mcp
├── .env.example            # Environment variable template
├── src/
│   └── server.js           # MCP server entry point (35+ tools, JSON-RPC 2.0)
└── README.md
```

---

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

Server starts on `http://localhost:3000` with a JSON-RPC 2.0 endpoint.

---

## Installation

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

### Cursor

In **Cursor Settings → Features → MCP Servers → Add New**:

```
Name:   bolsa-de-carga
Type:   command
Command: node /path/to/bolsa_de_carga-mcp/src/server.js
Env:    API_KEY=your-api-key
```

### Direct HTTP (for custom integrations)

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

---

## MCP protocol in action

**Search active freight auctions:**

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "bolsa_auctions_active",
    "params": {
      "limit": 10,
      "from": "Madrid",
      "to": "Barcelona"
    }
  }'
```

**Response:**

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

**Create and publish a new freight auction:**

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "bolsa_auctions_create",
    "params": {
      "fromAddressId": "addr_123",
      "toAddressId": "addr_456",
      "goods": {
        "description": "Industrial machinery",
        "weight": 5000,
        "palletCount": 4
      },
      "pickupDate": "2026-06-01",
      "deliveryDate": "2026-06-03"
    }
  }'
```

---

## Example Prompts for AI Agents

> "Show me all active freight loads from Madrid to Barcelona under 10 tons."

> "Create a new auction for a 5-ton machinery shipment from Valencia to Seville, pickup next Monday."

> "Accept the highest bid on auction MADBCNnT4FN and generate the CMR waybill."

> "Register a new truck with 24-ton capacity and refrigerated trailer to our fleet."

> "List all deliveries pending CMR signature and download their waybill PDFs."

> "What's our current auction win rate this month? Show me closed vs. active auctions."

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_KEY` | Cargoffer API key (required for production) | - |
| `API_URL` | API base URL | `https://api.pro.cargoffer.com` |
| `PORT` | Server port | `3000` |

### Local Development

```bash
# Use local backend
API_URL=http://localhost:8090 API_KEY=your-key node src/server.js

# Or copy .env.example
cp .env.example .env
# Edit .env with your values
node src/server.js
```

The `.env.example` file contains the template:

```
API_KEY=your-key
API_URL=https://api.pro.cargoffer.com
PORT=3000
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/tools` | GET | List available tools |
| `/` | POST | JSON-RPC 2.0 endpoint |

---

## Semantic tags

`freight marketplace MCP` `load board API` `MCP server` `Model Context Protocol` `European road transport` `logistics document automation` `Bolsa de Carga` `freight auction` `load board` `truck brokerage` `CMR waybill` `freight matching` `AI agents` `LLM tools` `supply chain` `spot market` `Cargoffer` `trucking` `freight logistics` `Spain cargo` `easy MCP integration`

---

## Getting an API Key

Contact Cargoffer to get an API key for production use:
- **Email:** cto@cargoffer.com
- Or request through your Cargoffer dashboard

---

## License

MIT — see [LICENSE](LICENSE) file for details.

---

## Links

- **Repository:** [github.com/cargoffer/bolsa_de_carga-mcp](https://github.com/cargoffer/bolsa_de_carga-mcp)
- **Issues:** [github.com/cargoffer/bolsa_de_carga-mcp/issues](https://github.com/cargoffer/bolsa_de_carga-mcp/issues)
- **MCP Protocol:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
