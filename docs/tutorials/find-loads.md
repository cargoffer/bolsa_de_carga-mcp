# Find Loads

Search for available freight in the European marketplace.

## Basic Search

```typescript
const loads = await client.callTool("bolsa_find_loads", {
  origin: { country: "ES" },
  destination: { country: "PT" },
  vehicle_type: "remolque"
});
```

## Advanced Filters

```typescript
const loads = await client.callTool("bolsa_find_loads", {
  origin: "Madrid",
  destination: ["Lisbon", "Porto"],
  vehicle_type: "frigorifico",
  min_price: 500,
  max_distance: 500,
  commodities: ["electronics", "pharma"]
});
```

## Save Searches

```typescript
const saved = await client.callTool("bolsa_save_search", {
  name: "Madrid-Portugal loads",
  criteria: { origin: "Madrid", destination: "Portugal" }
});
```

## Next Steps

👉 [Get API Key](https://client.release.transcend.cargoffer.com/)
