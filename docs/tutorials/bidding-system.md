# Bidding System

Dutch auction and lowering bid functionality.

## Place Initial Bid

```typescript
const bid = await client.callTool("bolsa_place_bid", {
  load_id: "LOAD-XXXXX",
  amount: 450,
  currency: "EUR"
});
```

## Dutch Auction (Lowering)

```typescript
// Start dutch auction
const auction = await client.callTool("bolsa_dutch_auction", {
  load_id: "LOAD-XXXXX",
  start_price: 600,
  floor_price: 350,
  decrement: 10,
  interval_minutes: 15
});
```

## Counter Offer

```typescript
const counter = await client.callTool("bolsa_counter_offer", {
  load_id: "LOAD-XXXXX",
  propose: 400
});
```

## Next Steps

👉 [Get API Key](https://client.release.transcend.cargoffer.com/)
