# Post Trucks

List your available truck capacity in the marketplace.

## Post Available Capacity

```typescript
const post = await client.callTool("bolsa_post_truck", {
  origin: "Madrid",
  destination: "Paris",
  available_date: "2026-06-01",
  vehicle_type: "remolque",
  capacity_kg: 24000,
  dimensions: { length: 13.6, width: 2.45, height: 2.7 }
});
```

## Update Availability

```typescript
const update = await client.callTool("bolsa_update_truck", {
  post_id: "POST-XXXXX",
  status: "booked",
  booking_ref: "BOOK-YYYYY"
});
```

## Direct Messaging

```typescript
const msg = await client.callTool("bolsa_send_message", {
  post_id: "POST-XXXXX",
  message: "Available from June 3rd"
});
```

## Next Steps

👉 [Get API Key](https://client.release.transcend.cargoffer.com/)
