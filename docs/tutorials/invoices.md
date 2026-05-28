# Invoices

Generate and manage invoices for shipments.

## Generate Invoice

```typescript
const invoice = await client.callTool("bolsa_generate_invoice", {
  shipment_id: "SHIP-XXXXX",
  invoice_type: "freight"
});
```

## Invoice Details

```typescript
const details = await client.callTool("bolsa_invoice_details", {
  invoice_id: "INV-XXXXX"
});
```

## Payment Status

```typescript
const payment = await client.callTool("bolsa_payment_status", {
  invoice_id: "INV-XXXXX"
});
```

## Bulk Invoicing

```typescript
const bulk = await client.callTool("bolsa_bulk_invoice", {
  period: "2026-05-01-to-2026-05-31"
});
```

## Next Steps

👉 [Get API Key](https://client.release.transcend.cargoffer.com/)
