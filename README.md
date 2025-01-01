# Vinegar (January 2025 00:00 Commit Version)

## Vinegar Server

### How to run instance of Vinegar server

`mv empty_coupons.db VinegarServer/coupons.db`

`npm install`

`node VinegarServer/server.js`

#### or

`$SHELL run.sh` where `$SHELL` is your shell of choice

## Vinegar Server API Endpoints (all under `/api` using JSON body)

### `/addcoupon`
#### - Adds coupon to DB
`code` - Coupon code (Text)

`marketplace` - Marketplace (Text, domain name, **NOT A HASH**)

`expiration_date` - Coupon expiration date (UNIX timestamp, optional)

Example:
```json
{
    "code": "IPSUM",
    "marketplace": "example.com",
    "expiration_date": 1234567890
}
```

### `/coupons`
#### - Gets coupons of marketplace sorted by rating and popularity
`marketplace` - Marketplace (Text, domain name, **NOT A HASH**)

Example:
```json
{
    "marketplace": "www.example.com"
}
```

---

## `(empty_)coupons.db` DB Schema

### TABLE Coupons

#### NOTE: `marketplace_id` column stores `blake2b` hashes of the marketplace that are required to be sent in by the `addcoupon` API endpoint

code | marketplace_id | expiration_date | deletion_date | likes | dislikes
---- | ----------- | --------------- | ------------- | ----- | --------
TEXT NOT NULL PRIMARY KEY | TEXT REFERENCES Marketplace(marketplace_uuid) | INTEGER | INTEGER | INTEGER | INTEGER

### TABLE Marketplaces

marketplace_uuid | marketplace_name
-------------- | ----------------
TEXT NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT | TEXT

#### `marketplace_uuid` is the `blake2b` hash of the name of the marketplace
the name of the marketplace is determined by the domain name of said marketplace. For instance, `https://www.walmart.com/whatevercomesafter?trackersgalore=LMAOOO&this=true` becomes `www.walmart.com` where the UUID is `sha256hash(www.walmart.com)`

---

## Vinegar extension

TBD lmao :3