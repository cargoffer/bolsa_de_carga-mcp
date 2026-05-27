/**
 * Cargoffer Bolsa de Carga MCP Server
 * Expanded to cover 281 endpoints
 */

import http from 'http';
import https from 'https';

const API_URL = process.env.API_URL || 'https://api.pro.cargoffer.com';
const API_KEY = process.env.API_KEY || "";
let JWT_TOKEN = "";

const isHttps = API_URL.startsWith('https://');
const httpModule = isHttps ? https : http;

function setAuth(token) { JWT_TOKEN = token; }

const apiRequest = (method, path, body = null, authToken = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const headers = { 'Content-Type': 'application/json' };
    
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
        try { resolve(JSON.parse(data)); }
        catch { resolve({ raw: data }); }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function handleRequest(req) {
  const { jsonrpc, id, method, params = {} } = req;
  try {
    // Dynamic handler - extract module from tool name
    const match = method.match(/^bolsa_(\w+)_/);
    if (!match) throw new Error(`Invalid tool name: ${method}`);
    
    const module = match[1];
    // Strip API key parts
    const cleanMethod = method.replace(/^bolsa_\w+_/, '');
    
    // Build API path (/company/MODULE/...)
    let apiPath = `/company/${module}`;
    if (params.id) apiPath += `/${params.id}`;
    else if (params.serviceCode) apiPath += `/${params.serviceCode}`;
    
    const result = await apiRequest('GET', apiPath, params);
    return { jsonrpc: '2.0', id, result };
  } catch (error) {
    return { jsonrpc: '2.0', id, error: { code: -32601, message: error.message } };
  }
}

// Tool definitions
const toolDefinitions = [
  { name: "bolsa_address_create", description: "Create new address", inputSchema: {type: "object"} },
  { name: "bolsa_address_get", description: "Get company addresses", inputSchema: {type: "object"} },
  { name: "bolsa_address_update", description: "Update address", inputSchema: {type: "object"} },
  { name: "bolsa_address_create", description: "Create simplified address", inputSchema: {type: "object"} },
  { name: "bolsa_address_update", description: "Update address (POST alternative)", inputSchema: {type: "object"} },
  { name: "bolsa_address_update", description: "Update specific address by ID (POST alternative)", inputSchema: {type: "object"} },
  { name: "bolsa_address_export", description: "Export addresses to CSV", inputSchema: {type: "object"} },
  { name: "bolsa_address_update", description: "Update specific address", inputSchema: {type: "object"} },
  { name: "bolsa_address_delete", description: "Delete address", inputSchema: {type: "object"} },
  { name: "bolsa_address_bulk", description: "Bulk import addresses from CSV", inputSchema: {type: "object"} },
  { name: "bolsa_address_download", description: "Download CSV template for bulk import", inputSchema: {type: "object"} },
  { name: "bolsa_address_get", description: "Get bulk import instructions", inputSchema: {type: "object"} },
  { name: "bolsa_apikey_create", description: "Create New API Key", inputSchema: {type: "object"} },
  { name: "bolsa_apikey_get", description: "Get User API Keys", inputSchema: {type: "object"} },
  { name: "bolsa_apikey_delete", description: "Delete User API Key", inputSchema: {type: "object"} },
  { name: "bolsa_auction-actions_get", description: "Get active auctions", inputSchema: {type: "object"} },
  { name: "bolsa_auction-actions_accept", description: "Accept current winning bid", inputSchema: {type: "object"} },
  { name: "bolsa_auction-actions_reject", description: "Reject current winning bid", inputSchema: {type: "object"} },
  { name: "bolsa_auction-actions_block", description: "Block auction", inputSchema: {type: "object"} },
  { name: "bolsa_auction-bulk_bulk", description: "Bulk upload from CSV", inputSchema: {type: "object"} },
  { name: "bolsa_auction-bulk_download", description: "Download CSV template", inputSchema: {type: "object"} },
  { name: "bolsa_auction-bulk_get", description: "Get instructions", inputSchema: {type: "object"} },
  { name: "bolsa_auction-contract_get", description: "Get auctions pending signature", inputSchema: {type: "object"} },
  { name: "bolsa_auction-contract_sign", description: "Sign auction digitally", inputSchema: {type: "object"} },
  { name: "bolsa_auction-contract_update", description: "Update contract with images", inputSchema: {type: "object"} },
  { name: "bolsa_auction-contract_download", description: "Download contract PDF", inputSchema: {type: "object"} },
  { name: "bolsa_auction-contract_cancel", description: "Cancel service", inputSchema: {type: "object"} },
  { name: "bolsa_auction-favorites_create", description: "Create favorite route", inputSchema: {type: "object"} },
  { name: "bolsa_auction-favorites_list", description: "List company favorite routes", inputSchema: {type: "object"} },
  { name: "bolsa_auction-favorites_edit", description: "Edit existing favorite", inputSchema: {type: "object"} },
  { name: "bolsa_auction-favorites_edit", description: "Edit favorite by path ID", inputSchema: {type: "object"} },
  { name: "bolsa_auction-favorites_delete", description: "Delete favorite route", inputSchema: {type: "object"} },
  { name: "bolsa_auction-management_create", description: "Create New Transport Auction", inputSchema: {type: "object"} },
  { name: "bolsa_auction-management_list", description: "List company auctions", inputSchema: {type: "object"} },
  { name: "bolsa_auction-management_update", description: "Update existing auction", inputSchema: {type: "object"} },
  { name: "bolsa_auction-management_get", description: "Get full auction details", inputSchema: {type: "object"} },
  { name: "bolsa_auction-management_delete", description: "Delete auction", inputSchema: {type: "object"} },
  { name: "bolsa_auction-management_convert", description: "Convert empty auction to draft", inputSchema: {type: "object"} },
  { name: "bolsa_auction-management_create", description: "Create private auction", inputSchema: {type: "object"} },
  { name: "bolsa_auction-management_create", description: "Create auction for specific providers", inputSchema: {type: "object"} },
  { name: "bolsa_auction_crear", description: "Crear nueva subasta de transporte", inputSchema: {type: "object"} },
  { name: "bolsa_auction_listar", description: "Listar subastas de la compañía", inputSchema: {type: "object"} },
  { name: "bolsa_auction_actualizar", description: "Actualizar subasta existente", inputSchema: {type: "object"} },
  { name: "bolsa_auction_obtener", description: "Obtener detalles completos de una subasta", inputSchema: {type: "object"} },
  { name: "bolsa_auction_eliminar", description: "Eliminar subasta", inputSchema: {type: "object"} },
  { name: "bolsa_auction_obtener", description: "Obtener subastas activas con ofertas en curso", inputSchema: {type: "object"} },
  { name: "bolsa_auction_aceptar", description: "Aceptar la puja ganadora actual", inputSchema: {type: "object"} },
  { name: "bolsa_auction_rechazar", description: "Rechazar la puja ganadora actual", inputSchema: {type: "object"} },
  { name: "bolsa_auction_bloquear", description: "Bloquear subasta", inputSchema: {type: "object"} },
  { name: "bolsa_auction_convertir", description: "Convertir subasta vacía en borrador editable", inputSchema: {type: "object"} },
  { name: "bolsa_auction_crear", description: "Crear subasta privada", inputSchema: {type: "object"} },
  { name: "bolsa_auction_crear", description: "Crear subasta para proveedores específicos", inputSchema: {type: "object"} },
  { name: "bolsa_auction_crear", description: "Crear ruta favorita para reutilización", inputSchema: {type: "object"} },
  { name: "bolsa_auction_listar", description: "Listar rutas favoritas de la compañía", inputSchema: {type: "object"} },
  { name: "bolsa_auction_editar", description: "Editar favorito existente", inputSchema: {type: "object"} },
  { name: "bolsa_auction_editar", description: "Editar favorito por ID en path", inputSchema: {type: "object"} },
  { name: "bolsa_auction_eliminar", description: "Eliminar ruta favorita", inputSchema: {type: "object"} },
  { name: "bolsa_auction_editar", description: "Editar favoritos (bulk)", inputSchema: {type: "object"} },
  { name: "bolsa_auction_editar", description: "Editar favorito específico por ID en path", inputSchema: {type: "object"} },
  { name: "bolsa_auction_obtener", description: "Obtener subastas pendientes de firma", inputSchema: {type: "object"} },
  { name: "bolsa_auction_firmar", description: "Firmar subasta digitalmente", inputSchema: {type: "object"} },
  { name: "bolsa_auction_actualizar", description: "Actualizar contrato con imágenes", inputSchema: {type: "object"} },
  { name: "bolsa_auction_descargar", description: "Descargar contrato PDF", inputSchema: {type: "object"} },
  { name: "bolsa_auction_cancelar", description: "Cancelar servicio", inputSchema: {type: "object"} },
  { name: "bolsa_auction_carga", description: "Carga masiva desde CSV", inputSchema: {type: "object"} },
  { name: "bolsa_auction_descargar", description: "Descargar plantilla CSV", inputSchema: {type: "object"} },
  { name: "bolsa_auction_obtener", description: "Obtener instrucciones", inputSchema: {type: "object"} },
  { name: "bolsa_auctions_get", description: "GET /company/auctions/favorites", inputSchema: {type: "object"} },
  { name: "bolsa_auctions_get", description: "GET /company/auctions/nearby", inputSchema: {type: "object"} },
  { name: "bolsa_auctions_get", description: "GET /company/auctions/search-location", inputSchema: {type: "object"} },
  { name: "bolsa_auctions_get", description: "GET /company/auctions/image/:code", inputSchema: {type: "object"} },
  { name: "bolsa_auctions_get", description: "GET /company/auctions/:code", inputSchema: {type: "object"} },
  { name: "bolsa_auctions_get", description: "GET /company/auctions/", inputSchema: {type: "object"} },
  { name: "bolsa_auth_enterprise", description: "Enterprise User Authentication", inputSchema: {type: "object"} },
  { name: "bolsa_auth_register", description: "Register New Company", inputSchema: {type: "object"} },
  { name: "bolsa_auth_reset", description: "Reset User Password (Admin)", inputSchema: {type: "object"} },
  { name: "bolsa_auth_password", description: "Password Recovery Request", inputSchema: {type: "object"} },
  { name: "bolsa_auth_render", description: "Render Password Recovery Page", inputSchema: {type: "object"} },
  { name: "bolsa_auth_change", description: "Change Password with Recovery Token", inputSchema: {type: "object"} },
  { name: "bolsa_auth_resend", description: "Resend Activation Email (Admin)", inputSchema: {type: "object"} },
  { name: "bolsa_auth_activate", description: "Activate Account (User Link)", inputSchema: {type: "object"} },
  { name: "bolsa_auth_check", description: "Check if Profile is Complete", inputSchema: {type: "object"} },
  { name: "bolsa_auth_validate", description: "Validate Invitation Token for Provider Registration", inputSchema: {type: "object"} },
  { name: "bolsa_auth_get", description: "Get Available Account Types", inputSchema: {type: "object"} },
  { name: "bolsa_bid_auctions_search", description: "Search available auctions", inputSchema: {type: "object"} },
  { name: "bolsa_bid_auctions_create", description: "Create a new bid", inputSchema: {type: "object"} },
  { name: "bolsa_bid_auctions_search", description: "Search locations across all published auctions", inputSchema: {type: "object"} },
  { name: "bolsa_bid_auctions_search", description: "Search locations from user's auctions", inputSchema: {type: "object"} },
  { name: "bolsa_bid_auctions_get", description: "Get my active auctions", inputSchema: {type: "object"} },
  { name: "bolsa_bid_auctions_get", description: "Get full auction details", inputSchema: {type: "object"} },
  { name: "bolsa_bid_auctions_delete", description: "Delete a bid", inputSchema: {type: "object"} },
  { name: "bolsa_bid_auctions_get", description: "Get minimal bid information with costs", inputSchema: {type: "object"} },
  { name: "bolsa_bid_auctions_digitally", description: "Digitally sign an awarded auction", inputSchema: {type: "object"} },
  { name: "bolsa_billing_obtener", description: "Obtener facturación del mes actual", inputSchema: {type: "object"} },
  { name: "bolsa_billing_actualizar", description: "Actualizar política de overage de la empresa", inputSchema: {type: "object"} },
  { name: "bolsa_billing_sincronizar", description: "Sincronizar recursos existentes con Stripe Meter", inputSchema: {type: "object"} },
  { name: "bolsa_billing_procesar", description: "Procesar reportes pendientes de Stripe Meter", inputSchema: {type: "object"} },
  { name: "bolsa_billing_obtener", description: "Obtener estadísticas de sincronización con Stripe", inputSchema: {type: "object"} },
  { name: "bolsa_billing_obtener", description: "Obtener histórico de facturación por rango de fechas", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_add", description: "Add a new carrier", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_get", description: "Get my carriers with pagination", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_get", description: "Get list of all carriers", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_get", description: "Get carriers for an auction", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_get", description: "Get carrier details", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_update", description: "Update carrier", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_delete", description: "Delete a carrier", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_create", description: "Create a driver for a carrier", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_get", description: "Get all drivers for a carrier", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_get", description: "Get drivers with pagination", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_update", description: "Update a driver", inputSchema: {type: "object"} },
  { name: "bolsa_carriers_delete", description: "Delete a driver", inputSchema: {type: "object"} },
  { name: "bolsa_categories_search", description: "Search HS codes by term", inputSchema: {type: "object"} },
  { name: "bolsa_cmr_get", description: "Get CMR document in PDF format", inputSchema: {type: "object"} },
  { name: "bolsa_cmr_send", description: "Send CMR document by email.", inputSchema: {type: "object"} },
  { name: "bolsa_company_data_check", description: "Check if the company profile is complete.", inputSchema: {type: "object"} },
  { name: "bolsa_company_data_retrieves", description: "Retrieves the company's complete data", inputSchema: {type: "object"} },
  { name: "bolsa_company_data_update", description: "Update the company data", inputSchema: {type: "object"} },
  { name: "bolsa_company_data_upload", description: "Upload or edit the company's digital signature.", inputSchema: {type: "object"} },
  { name: "bolsa_contact_create", description: "Create contact/support ticket", inputSchema: {type: "object"} },
  { name: "bolsa_contracts_get", description: "Get list of contracts", inputSchema: {type: "object"} },
  { name: "bolsa_contracts_send", description: "Send contract by email", inputSchema: {type: "object"} },
  { name: "bolsa_contracts_download", description: "Download contract in PDF", inputSchema: {type: "object"} },
  { name: "bolsa_countries_get", description: "Get regex patterns for field validation by country", inputSchema: {type: "object"} },
  { name: "bolsa_countries_get", description: "Get public list of enabled countries", inputSchema: {type: "object"} },
  { name: "bolsa_countries_get", description: "Get all countries including disabled ones (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_countries_create", description: "Create new country (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_countries_update", description: "Update existing country (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_countries_soft", description: "Soft delete a country (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_dashboard_get", description: "Get dashboard statistics", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_get", description: "GET /company/deliveries/search-location", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_post", description: "POST /company/deliveries/tracking/:service_code", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_get", description: "GET /company/deliveries/trackable", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_get", description: "GET /company/deliveries/active", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_get", description: "GET /company/deliveries/route/:service_code", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_get", description: "GET /company/deliveries/:service_code", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_delete", description: "DELETE /company/deliveries/delete/:id", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_post", description: "POST /company/deliveries/msg/:id", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_put", description: "PUT /company/deliveries/notes/:id", inputSchema: {type: "object"} },
  { name: "bolsa_deliveries_get", description: "GET /company/deliveries/", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_list", description: "List all shipments", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_get", description: "Get active shipments", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_get", description: "Get delivery details", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_edit", description: "Edit delivery", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_cancel", description: "Cancel delivery service", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_approve", description: "Approve delivery changes", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_save", description: "Save custom code", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_get", description: "Get trackable truckers", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_get", description: "Get delivery route and tracking", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_download", description: "Download delivery documentation ZIP", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_send", description: "Send message to delivery", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_get", description: "Get delivery messages", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_list", description: "List delivery documents", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_upload", description: "Upload delivery documents", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_download", description: "Download delivery document", inputSchema: {type: "object"} },
  { name: "bolsa_delivery_delete", description: "Delete delivery document", inputSchema: {type: "object"} },
  { name: "bolsa_dgt_post", description: "POST /company/dgt/email", inputSchema: {type: "object"} },
  { name: "bolsa_dgt_put", description: "PUT /company/dgt/:id", inputSchema: {type: "object"} },
  { name: "bolsa_dgt_post", description: "POST /company/dgt/", inputSchema: {type: "object"} },
  { name: "bolsa_documents_list", description: "List company documents", inputSchema: {type: "object"} },
  { name: "bolsa_documents_create", description: "Create new document", inputSchema: {type: "object"} },
  { name: "bolsa_documents_updateversion", description: "Update/Version document", inputSchema: {type: "object"} },
  { name: "bolsa_documents_delete", description: "Delete document (soft delete)", inputSchema: {type: "object"} },
  { name: "bolsa_documents_download", description: "Download a file from S3/MinIO storage", inputSchema: {type: "object"} },
  { name: "bolsa_documents_list", description: "List document types available for the authenticated user", inputSchema: {type: "object"} },
  { name: "bolsa_drivers_add", description: "Add a driver to a carrier", inputSchema: {type: "object"} },
  { name: "bolsa_drivers_list", description: "List all drivers of a carrier", inputSchema: {type: "object"} },
  { name: "bolsa_drivers_update", description: "Update driver information", inputSchema: {type: "object"} },
  { name: "bolsa_drivers_remove", description: "Remove a driver", inputSchema: {type: "object"} },
  { name: "bolsa_fee_get", description: "GET /company/fee/", inputSchema: {type: "object"} },
  { name: "bolsa_invoices_get", description: "Get paginated list of invoices", inputSchema: {type: "object"} },
  { name: "bolsa_invoices_create", description: "Create new invoice", inputSchema: {type: "object"} },
  { name: "bolsa_invoices_get", description: "Get details of a specific invoice", inputSchema: {type: "object"} },
  { name: "bolsa_invoices_update", description: "Update invoice payment status", inputSchema: {type: "object"} },
  { name: "bolsa_invoices_update", description: "Update invoice payment details", inputSchema: {type: "object"} },
  { name: "bolsa_issues_list", description: "List support incidents/tickets", inputSchema: {type: "object"} },
  { name: "bolsa_issues_create", description: "Create new support incident/ticket", inputSchema: {type: "object"} },
  { name: "bolsa_issues_get", description: "Get available service codes", inputSchema: {type: "object"} },
  { name: "bolsa_issues_get", description: "Get reasons for incidents", inputSchema: {type: "object"} },
  { name: "bolsa_issues_get", description: "Get incident details", inputSchema: {type: "object"} },
  { name: "bolsa_issues_add", description: "Add message to an issue", inputSchema: {type: "object"} },
  { name: "bolsa_issues_delete", description: "Delete an incident", inputSchema: {type: "object"} },
  { name: "bolsa_issues_mark", description: "Mark incident as resolved", inputSchema: {type: "object"} },
  { name: "bolsa_legal_obtain", description: "Obtain legal documents", inputSchema: {type: "object"} },
  { name: "bolsa_legal_update", description: "Update legal documents", inputSchema: {type: "object"} },
  { name: "bolsa_minimal_calculate", description: "Calculate CO2 emissions for a transport route", inputSchema: {type: "object"} },
  { name: "bolsa_minimal_calculate", description: "Calculate raw transportation costs (fuel, tolls, maintenance)", inputSchema: {type: "object"} },
  { name: "bolsa_minimal_get", description: "Get detailed route information with waypoints", inputSchema: {type: "object"} },
  { name: "bolsa_minimal_calculate", description: "Calculate minimum price for freight transport", inputSchema: {type: "object"} },
  { name: "bolsa_minimal_calculate", description: "Calculate transportation costs from city names (POST variant)", inputSchema: {type: "object"} },
  { name: "bolsa_minimal_get", description: "Get toll costs for an auction by MongoDB ObjectId", inputSchema: {type: "object"} },
  { name: "bolsa_notifications_get", description: "Get dashboard notifications and pending actions", inputSchema: {type: "object"} },
  { name: "bolsa_notifications_mark", description: "Mark notification as read", inputSchema: {type: "object"} },
  { name: "bolsa_notifications_delete", description: "Delete notification", inputSchema: {type: "object"} },
  { name: "bolsa_payment_verificar", description: "Verificar aceptación de términos de pago", inputSchema: {type: "object"} },
  { name: "bolsa_payment_aceptar", description: "Aceptar términos y condiciones de pago", inputSchema: {type: "object"} },
  { name: "bolsa_payment_registrar", description: "Registrar compañía como cliente en Stripe", inputSchema: {type: "object"} },
  { name: "bolsa_payment_obtener", description: "Obtener URLs de checkout para planes de suscripción", inputSchema: {type: "object"} },
  { name: "bolsa_payment_acceder", description: "Acceder al portal de cliente de Stripe para gestionar suscripción", inputSchema: {type: "object"} },
  { name: "bolsa_payment_procesar", description: "Procesar pago de una entrega", inputSchema: {type: "object"} },
  { name: "bolsa_payment_configurar", description: "Configurar nuevo método de pago", inputSchema: {type: "object"} },
  { name: "bolsa_payment_obtener", description: "Obtener lista de métodos de pago", inputSchema: {type: "object"} },
  { name: "bolsa_payment_eliminar", description: "Eliminar método de pago", inputSchema: {type: "object"} },
  { name: "bolsa_payment_establecer", description: "Establecer método de pago por defecto", inputSchema: {type: "object"} },
  { name: "bolsa_payment_obtener", description: "Obtener estado de pagos con Stripe", inputSchema: {type: "object"} },
  { name: "bolsa_payment_activar", description: "Activar o desactivar pagos con Stripe", inputSchema: {type: "object"} },
  { name: "bolsa_payment_obtener", description: "Obtener detalles de la cuenta Stripe Connect", inputSchema: {type: "object"} },
  { name: "bolsa_payment_actualizar", description: "Actualizar datos de la cuenta Stripe Connect", inputSchema: {type: "object"} },
  { name: "bolsa_payment_obtener", description: "Obtener enlace de onboarding para cuenta bancaria", inputSchema: {type: "object"} },
  { name: "bolsa_payment_generar", description: "Generar enlace de onboarding para cuenta bancaria (POST)", inputSchema: {type: "object"} },
  { name: "bolsa_payment_callback", description: "Callback de retorno del onboarding de Stripe Connect", inputSchema: {type: "object"} },
  { name: "bolsa_payment_callback", description: "Callback de refresh del onboarding de Stripe Connect", inputSchema: {type: "object"} },
  { name: "bolsa_qr_obtener", description: "Obtener información de entrega por token QR", inputSchema: {type: "object"} },
  { name: "bolsa_qr_confirmar", description: "Confirmar entrega mediante token QR", inputSchema: {type: "object"} },
  { name: "bolsa_qr_reportar", description: "Reportar incidencia en una entrega", inputSchema: {type: "object"} },
  { name: "bolsa_trailers_delete", description: "DELETE /company/trailers/:id", inputSchema: {type: "object"} },
  { name: "bolsa_trailers_post", description: "POST /company/trailers/", inputSchema: {type: "object"} },
  { name: "bolsa_trucker_cia_put", description: "PUT /company/trucker_cia/", inputSchema: {type: "object"} },
  { name: "bolsa_trucker_cia_post", description: "POST /company/trucker_cia/edit", inputSchema: {type: "object"} },
  { name: "bolsa_trucker_cia_put", description: "PUT /company/trucker_cia/:id", inputSchema: {type: "object"} },
  { name: "bolsa_trucker_cia_post", description: "POST /company/trucker_cia/edit/:id", inputSchema: {type: "object"} },
  { name: "bolsa_trucker_group_post", description: "POST /company/trucker_group/", inputSchema: {type: "object"} },
  { name: "bolsa_trucker_group_delete", description: "DELETE /company/trucker_group/:code", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_get", description: "Get list of truckers", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_create", description: "Create new trucker", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_get", description: "Get trucker details", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_update", description: "Update trucker", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_delete", description: "Delete trucker", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_get", description: "Get trucker by taxid", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_get", description: "Get trucker company contact info", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_bulk_bulk", description: "Bulk create truckers from CSV", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_bulk_download", description: "Download CSV template", inputSchema: {type: "object"} },
  { name: "bolsa_truckers_bulk_get", description: "Get bulk import notes", inputSchema: {type: "object"} },
  { name: "bolsa_users-history_get", description: "Get user action history", inputSchema: {type: "object"} },
  { name: "bolsa_users-history_get", description: "Get user access history", inputSchema: {type: "object"} },
  { name: "bolsa_users-lifecycle_change", description: "Change user status (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users-lifecycle_disable", description: "Disable user (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users-lifecycle_check", description: "Check if user is disabled", inputSchema: {type: "object"} },
  { name: "bolsa_users-lifecycle_reactivate", description: "Reactivate disabled user (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users-lifecycle_soft", description: "Soft disable user with reason (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users-management_get", description: "Get user details by ID", inputSchema: {type: "object"} },
  { name: "bolsa_users-management_update", description: "Update user profile (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users-management_delete", description: "Delete user with soft delete (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users-management_list", description: "List company users with pagination", inputSchema: {type: "object"} },
  { name: "bolsa_users-management_create", description: "Create new user (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users-management_reset", description: "Reset user password (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users-management_request", description: "Request user documentation (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users-profile_get", description: "Get authenticated user profile", inputSchema: {type: "object"} },
  { name: "bolsa_users-profile_update", description: "Update authenticated user profile", inputSchema: {type: "object"} },
  { name: "bolsa_users-profile_change", description: "Change user password", inputSchema: {type: "object"} },
  { name: "bolsa_users-profile_get", description: "Get user language preference", inputSchema: {type: "object"} },
  { name: "bolsa_users-profile_set", description: "Set user language preference", inputSchema: {type: "object"} },
  { name: "bolsa_users-profile_send", description: "Send email verification", inputSchema: {type: "object"} },
  { name: "bolsa_users_get", description: "Get authenticated user profile", inputSchema: {type: "object"} },
  { name: "bolsa_users_update", description: "Update authenticated user profile", inputSchema: {type: "object"} },
  { name: "bolsa_users_get", description: "Get user details by ID", inputSchema: {type: "object"} },
  { name: "bolsa_users_update", description: "Update user profile (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users_delete", description: "Delete user with soft delete (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users_list", description: "List company users with pagination", inputSchema: {type: "object"} },
  { name: "bolsa_users_create", description: "Create new user (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users_change", description: "Change user password", inputSchema: {type: "object"} },
  { name: "bolsa_users_reset", description: "Reset user password (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users_get", description: "Get user language preference", inputSchema: {type: "object"} },
  { name: "bolsa_users_set", description: "Set user language preference", inputSchema: {type: "object"} },
  { name: "bolsa_users_get", description: "Get user action history", inputSchema: {type: "object"} },
  { name: "bolsa_users_get", description: "Get user access history", inputSchema: {type: "object"} },
  { name: "bolsa_users_send", description: "Send email verification", inputSchema: {type: "object"} },
  { name: "bolsa_users_change", description: "Change user status (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users_request", description: "Request user documentation (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users_disable", description: "Disable user (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users_check", description: "Check if user is disabled", inputSchema: {type: "object"} },
  { name: "bolsa_users_reactivate", description: "Reactivate disabled user (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_users_soft", description: "Soft disable user with reason (Admin only)", inputSchema: {type: "object"} },
  { name: "bolsa_vehicles_get", description: "Get available vehicle types", inputSchema: {type: "object"} },
  { name: "bolsa_vehicles_list", description: "List company vehicle fleet with pagination", inputSchema: {type: "object"} },
  { name: "bolsa_vehicles_create", description: "Create a new vehicle in the fleet", inputSchema: {type: "object"} },
  { name: "bolsa_vehicles_get", description: "Get details of a specific vehicle", inputSchema: {type: "object"} },
  { name: "bolsa_vehicles_update", description: "Update an existing vehicle", inputSchema: {type: "object"} },
  { name: "bolsa_vehicles_soft", description: "Soft delete a vehicle from the fleet", inputSchema: {type: "object"} },
  { name: "bolsa_vehicles_create", description: "Create multiple vehicles from CSV file", inputSchema: {type: "object"} },
  { name: "bolsa_vehicles_download", description: "Download CSV template for bulk vehicle import", inputSchema: {type: "object"} },
  { name: "bolsa_vehicles_download", description: "Download bulk import instructions in specified language", inputSchema: {type: "object"} },
];

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/health') {
    res.end(JSON.stringify({ status: 'ok', tools: toolDefinitions.length }));
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
  console.log(`Tools: ${toolDefinitions.length}`);
});

export default { handleRequest };
