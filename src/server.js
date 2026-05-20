/**
 * Cargoffer Bolsa de Carga MCP Server
 * Standalone implementation for Model Context Protocol
 */

import http from 'http';
import https from 'https';

const API_URL = process.env.API_URL || 'https://api.cargoffer.com';
const API_KEY = process.env.API_KEY || '';
let JWT_TOKEN = '';

// Use correct HTTP module based on URL
const isHttps = API_URL.startsWith('https://');
const httpModule = isHttps ? https : http;

// Store token after login
function setAuth(token) { 
  JWT_TOKEN = token; 
}

// Make API request
const apiRequest = (method, path, body = null, authToken = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const headers = { 'Content-Type': 'application/json' };
    
    // Use API key for /api/* routes, otherwise use passed token or stored JWT
    const isApiRoute = path.startsWith('/api/');
    if (isApiRoute && API_KEY) {
      headers['x-api-key'] = API_KEY;
    } else if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else if (JWT_TOKEN) {
      headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
    }
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + (url.search || ''),
      method,
      headers
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({ raw: data });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// MCP Protocol: JSON-RPC 2.0
async function handleRequest(req) {
  const { jsonrpc, id, method, params } = req;
  
  try {
    let result;
    
    switch(method) {
      // === AUCTIONS ===
      case 'bolsa_auctions_active': 
        result = await apiRequest('GET', `/api/auction/active?limit=${params.limit||50}`); 
        break;
      case 'bolsa_auction_get': 
        result = await apiRequest('GET', `/api/auction/${params.serviceCode}`); 
        break;
      case 'bolsa_auction_create':
        result = await apiRequest('POST', '/api/auction/', {
          from: { city: params.fromCity, postal_code: params.fromPostal, country: params.fromCountry || 'ES' },
          to: { city: params.toCity, postal_code: params.toPostal, country: params.toCountry || 'ES' },
          goods: { description: params.goodsDescription, weight: params.weight, packages: params.packages },
          vehicle_type: params.vehicleType,
          date_start: params.pickupDate || params.date_start,
          date_end: params.deliveryDate || params.date_end
        });
        break;
      case 'bolsa_auction_update':
        result = await apiRequest('PUT', `/api/auction/${params.serviceCode}`, params);
        break;
      case 'bolsa_auction_delete':
        result = await apiRequest('DELETE', `/api/auction/${params.serviceCode}`);
        break;
      case 'bolsa_auction_publish':
        result = await apiRequest('PUT', `/api/auction/publish/${params.serviceCode}`);
        break;
      case 'bolsa_auction_accept':
        result = await apiRequest('POST', `/api/auction/acceptCurrent/${params.serviceCode}`);
        break;
      case 'bolsa_auction_private':
        result = await apiRequest('POST', '/api/auction/private', params);
        break;
      case 'bolsa_auction_signed_list':
        result = await apiRequest('GET', `/api/auction/sign?limit=${params.limit||50}&signedBy=${params.signedBy||'company'}`);
        break;
      case 'bolsa_auction_contract':
        result = await apiRequest('POST', '/api/auction/contract/', params);
        break;
      case 'bolsa_auction_contract_get':
        result = await apiRequest('GET', `/api/auction/contract/${params.serviceCode}`);
        break;
      case 'bolsa_auction_contract_update':
        result = await apiRequest('PUT', `/api/auction/contract/${params.serviceCode}`, params);
        break;
      case 'bolsa_auction_contract_delete':
        result = await apiRequest('DELETE', `/api/auction/contract/${params.serviceCode}`);
        break;
      case 'bolsa_auction_sign':
        result = await apiRequest('PUT', `/api/auction/sign/${params.serviceCode}`, params);
        break;
      case 'bolsa_auction_favorites':
        result = await apiRequest('GET', '/api/auction/favorites');
        break;
      case 'bolsa_auction_favorite_add':
        result = await apiRequest('POST', '/api/auction/favorites/', params);
        break;
      case 'bolsa_auction_favorite_remove':
        result = await apiRequest('DELETE', `/api/auction/favorites/${params.id}`);
        break;
      
      // === ADDRESSES ===
      case 'bolsa_addresses_list':
        result = await apiRequest('GET', `/truckers/address?limit=${params.limit||50}`);
        break;
      case 'bolsa_address_create':
        // Add company_name required by backend
        result = await apiRequest('POST', '/truckers/address', {
          ...params,
          company_name: params.companyName || params.company_name || 'Testing CIA'
        });
        break;
      case 'bolsa_address_update':
        result = await apiRequest('PUT', `/truckers/address/${params.id}`, params);
        break;
      case 'bolsa_address_delete':
        result = await apiRequest('DELETE', `/truckers/address/${params.id}`);
        break;
      
// === TRUCKERS (Trailers) ===
      case 'bolsa_truckers_list': 
        result = await apiRequest('GET', `/truckers/trailers?limit=${params.limit||50}`);
        break;
      case 'bolsa_trucker_create':
        result = await apiRequest('POST', '/truckers/trailers', params);
        break;
      case 'bolsa_trucker_update':
        result = await apiRequest('PUT', `/truckers/trailers/${params.id}`, params);
        break;
      case 'bolsa_trucker_delete':
        result = await apiRequest('DELETE', `/truckers/trailers/${params.id}`);
        break;
     
      // === VEHICLES ===
      case 'bolsa_vehicles_list':
        result = await apiRequest('GET', `/truckers/vehicles?limit=${params.limit||50}`);
        break;
      case 'bolsa_vehicle_create':
        result = await apiRequest('POST', '/truckers/vehicles', params);
        break;
      case 'bolsa_vehicle_update':
        result = await apiRequest('PUT', `/truckers/vehicles/${params.id}`, params);
        break;
      case 'bolsa_vehicle_delete':
        result = await apiRequest('DELETE', `/truckers/vehicles/${params.id}`);
        break;
      
// === DELIVERY ===
      case 'bolsa_delivery_list':
        result = await apiRequest('GET', `/truckers/deliveries?limit=${params.limit||50}`);
        break;
      case 'bolsa_delivery_active':
        result = await apiRequest('GET', '/truckers/deliveries/active');
        break;
      case 'bolsa_delivery_get':
        result = await apiRequest('GET', `/truckers/deliveries/${params.serviceCode}`);
        break;
      case 'bolsa_delivery_download':
        result = await apiRequest('GET', `/truckers/deliveries/${params.serviceCode}/pdf`);
        break;
      case 'bolsa_delivery_msg':
        result = await apiRequest('POST', `/truckers/deliveries/${params.serviceCode}/msg`, params);
        break;
      case 'bolsa_delivery_msg_list':
        result = await apiRequest('GET', `/truckers/deliveries/${params.serviceCode}/msg`);
        break;
     
      // === OIL (Fuel) - NOT IMPLEMENTED ===
      case 'bolsa_oil_list':
        result = await apiRequest('GET', `/oil/?limit=${params.limit||50}`);
        break;
      case 'bolsa_oil_create':
        result = await apiRequest('POST', '/oil/', params);
        break;
      case 'bolsa_oil_update':
        result = await apiRequest('PUT', `/oil/${params.id}`, params);
        break;
      case 'bolsa_oil_delete':
        result = await apiRequest('DELETE', `/oil/${params.id}`);
        break;
      
      // === AUTH ===
      case 'bolsa_auth_login':
        result = await apiRequest('POST', '/truckers/auth/login', params);
        if (result?.data) {
          setAuth(result.data);
        }
        break;
      case 'bolsa_auth_register':
        result = await apiRequest('POST', '/truckers/auth/register', params);
        break;
      
      default:
        throw new Error(`Unknown method: ${method}`);
    }
    
    return { jsonrpc: '2.0', id, result };
  } catch (error) {
    return { jsonrpc: '2.0', id, error: { code: -32601, message: error.message } };
  }
}

// Tool definitions
const toolDefinitions = [
  // === AUCTIONS ===
  { name: "bolsa_auctions_active", description: "List active freight auctions", inputSchema: { type: "object", properties: { limit: { type: "number" } } } },
  { name: "bolsa_auction_get", description: "Get auction details", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_create", description: "Create new freight auction", inputSchema: { type: "object", properties: { fromCity: { type: "string" }, fromPostal: { type: "string" }, fromCountry: { type: "string" }, toCity: { type: "string" }, toPostal: { type: "string" }, toCountry: { type: "string" }, goodsDescription: { type: "string" }, weight: { type: "number" }, packages: { type: "number" }, vehicleType: { type: "string" }, pickupDate: { type: "string" } }, required: ["fromCity", "toCity", "goodsDescription", "vehicleType"] } },
  { name: "bolsa_auction_update", description: "Update auction", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_delete", description: "Delete auction", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_publish", description: "Publish auction to marketplace", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_accept", description: "Accept current bid and close auction", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_private", description: "Create private auction", inputSchema: { type: "object", properties: { fromCity: { type: "string" }, toCity: { type: "string" }, goodsDescription: { type: "string" }, truckerId: { type: "string" } }, required: ["fromCity", "toCity", "truckerId"] } },
  { name: "bolsa_auction_signed_list", description: "List signed auctions", inputSchema: { type: "object", properties: { limit: { type: "number" }, signedBy: { type: "string" } } } },
  { name: "bolsa_auction_contract", description: "Create contract for auction", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_contract_get", description: "Get contract details", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_contract_update", description: "Update contract", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_contract_delete", description: "Delete contract", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_sign", description: "Sign auction with CMR data", inputSchema: { type: "object", properties: { serviceCode: { type: "string" }, signature: { type: "string" } }, required: ["serviceCode", "signature"] } },
  { name: "bolsa_auction_favorites", description: "List favorite auctions", inputSchema: { type: "object" } },
  { name: "bolsa_auction_favorite_add", description: "Add auction to favorites", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_auction_favorite_remove", description: "Remove from favorites", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  
  // === ADDRESSES ===
  { name: "bolsa_addresses_list", description: "List addresses", inputSchema: { type: "object", properties: { limit: { type: "number" } } } },
  { name: "bolsa_address_create", description: "Create address", inputSchema: { type: "object", properties: { name: { type: "string" }, street: { type: "string" }, city: { type: "string" }, state: { type: "string" }, postalCode: { type: "string" }, country: { type: "string" } }, required: ["name", "street", "city"] } },
  { name: "bolsa_address_update", description: "Update address", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "bolsa_address_delete", description: "Delete address", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  
  // === TRUCKERS ===
  { name: "bolsa_truckers_list", description: "List truckers", inputSchema: { type: "object", properties: { limit: { type: "number" } } } },
  { name: "bolsa_trucker_create", description: "Create trucker", inputSchema: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, phone: { type: "string" }, license: { type: "string" } }, required: ["name", "phone"] } },
  { name: "bolsa_trucker_update", description: "Update trucker", inputSchema: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, phone: { type: "string" } }, required: ["id"] } },
  { name: "bolsa_trucker_delete", description: "Delete trucker", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  
  // === VEHICLES ===
  { name: "bolsa_vehicles_list", description: "List vehicles", inputSchema: { type: "object", properties: { limit: { type: "number" } } } },
  { name: "bolsa_vehicle_create", description: "Create vehicle", inputSchema: { type: "object", properties: { plate: { type: "string" }, type: { type: "string" }, brand: { type: "string" }, model: { type: "string" }, capacity: { type: "number" } }, required: ["plate"] } },
  { name: "bolsa_vehicle_update", description: "Update vehicle", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "bolsa_vehicle_delete", description: "Delete vehicle", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  
  // === DELIVERY ===
  { name: "bolsa_delivery_list", description: "List all deliveries", inputSchema: { type: "object", properties: { limit: { type: "number" } } } },
  { name: "bolsa_delivery_active", description: "List active deliveries", inputSchema: { type: "object" } },
  { name: "bolsa_delivery_get", description: "Get delivery details", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_delivery_download", description: "Download delivery CMR", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  { name: "bolsa_delivery_msg", description: "Send delivery message", inputSchema: { type: "object", properties: { serviceCode: { type: "string" }, message: { type: "string" } }, required: ["serviceCode", "message"] } },
  { name: "bolsa_delivery_msg_list", description: "List delivery messages", inputSchema: { type: "object", properties: { serviceCode: { type: "string" } }, required: ["serviceCode"] } },
  
  // === OIL (Fuel) ===
  { name: "bolsa_oil_list", description: "List fuel expenses", inputSchema: { type: "object", properties: { limit: { type: "number" } } } },
  { name: "bolsa_oil_create", description: "Create fuel expense", inputSchema: { type: "object", properties: { auctionId: { type: "string" }, amount: { type: "number" }, station: { type: "string" } }, required: ["auctionId", "amount"] } },
  { name: "bolsa_oil_update", description: "Update fuel expense", inputSchema: { type: "object", properties: { id: { type: "string" }, amount: { type: "number" } }, required: ["id"] } },
  { name: "bolsa_oil_delete", description: "Delete fuel expense", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  
  // === AUTH ===
  { name: "bolsa_auth_login", description: "Login to API", inputSchema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } }, required: ["email", "password"] } },
  { name: "bolsa_auth_register", description: "Register new user", inputSchema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" }, companyName: { type: "string" } }, required: ["email", "password", "companyName"] } },
];

// Server startup
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/health') {
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  
  if (req.url === '/tools') {
    res.end(JSON.stringify({ tools: toolDefinitions }));
    return;
  }
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }
  
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const request = JSON.parse(body);
        const response = await handleRequest(request);
        res.end(JSON.stringify(response));
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: { code: -32600, message: 'Invalid Request' } }));
      }
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: { code: -32600, message: 'Not Found' } }));
  }
});

server.listen(PORT, () => {
  console.log(`Bolsa de Carga MCP Server running on port ${PORT}`);
  console.log(`API: ${API_URL}`);
});

export default { handleRequest };