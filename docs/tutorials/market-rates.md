# Market Rates

Access current freight market rates for Europe.

## Get Current Rates

```typescript
const rates = await client.callTool("bolsa_get_rates", {
  origin: "Madrid",
  destination: "Lisbon",
  vehicle_type: "remolque"
});
```

## Historical Rates

```typescript
const history = await client.callTool("bolsa_rate_history", {
  origin: "Madrid",
  destination: "Lisbon",
  period: "last_90_days"
});
```

## Rate Alerts

```typescript
const alert = await client.callTool("bolsa_rate_alert", {
  route: "Madrid-Lisbon",
  target_rate: 450,
  notification: "email"
});
```

## Market Index

```typescript
const index = await client.callTool("bolsa_market_index", {
  region: "Iberian Peninsula",
  date: "2026-05"
});
```

## Next Steps

👉 [Get API Key](https://client.release.transcend.cargoffer.com/)
