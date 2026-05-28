# Quick Start

## Find Your First Load

```typescript
const loads = await client.callTool("bolsa_find_loads", {
  origin: "Spain",
  destination: "Portugal",
  vehicle_type: "remoque",
  date_from: "2026-06-01"
});

console.log(loads.length, "loads available");
```

## Post Your Truck Capacity

```typescript
const truck = await client.callTool("bolsa_post_truck", {
  origin: "Madrid",
  destination: "Lisbon",
  available_date: "2026-06-01",
  vehicle_type: "remolque",
  capacity_kg: 20000
});
```
