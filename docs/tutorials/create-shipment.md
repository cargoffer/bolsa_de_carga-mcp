# Create Shipment

Book and manage shipments in the freight marketplace.

## Book a Load

```typescript
const shipment = await client.callTool("bolsa_book_shipment", {
  load_id: "LOAD-XXXXX",
  rate_id: "RATE-YYYYY"
});
```

## Booking Confirmation

```typescript
const confirmation = await client.callTool("bolsa_confirm_booking", {
  shipment_id: "SHIP-ZZZZZ",
  pickup_time: "2026-06-01T08:00:00Z",
  contact_phone: "+34..."
});
```

## Cancel Booking

```typescript
const cancel = await client.callTool("bolsa_cancel_shipment", {
  shipment_id: "SHIP-ZZZZZ",
  reason: "Customer cancellation"
});
```

## Next Steps

👉 [Get API Key](https://client.release.transcend.cargoffer.com/)
