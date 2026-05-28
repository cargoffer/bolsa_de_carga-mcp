# Tracking

Live shipment tracking in the freight marketplace.

## Track Shipment

```typescript
const tracking = await client.callTool("bolsa_track", {
  shipment_id: "SHIP-XXXXX"
});

console.log(tracking.current_location);
console.log(tracking.eta);
console.log(tracking.status);
```

## Route History

```typescript
const history = await client.callTool("bolsa_timeline", {
  shipment_id: "SHIP-XXXXX"
});
```

## ETA Updates

```typescript
const eta = await client.callTool("bolsa_eta", {
  shipment_id: "SHIP-XXXXX"
});
```

## Next Steps

👉 [Get API Key](https://client.release.transcend.cargoffer.com/)
