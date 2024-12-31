# Vinegar server+etc (NOT FUNCTIONAL YET):

## How to run instance of Vinegar server:

`npm install`

`node coupons-server/server.js`

#### or

`$SHELL run.sh` where `$SHELL` is your shell of choice

### API Endpoints:

#### TBD

---

## `coupons.db` DB Schema:

### TABLE Coupons

code | marketplace | expiration_date | deletion_date | likes | dislikes
---- | ----------- | --------------- | ------------- | ----- | --------
TEXT NOT NULL PRIMARY KEY | TEXT REFERENCES Marketplace(marketplace_uuid) | INTEGER | INTEGER | INTEGER | INTEGER

### TABLE Marketplaces

marketplace_uuid | marketplace_name
-------------- | ----------------
TEXT NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT | TEXT

#### `marketplace_uuid` is the `sha256` hash of the name of the marketplace
the name of the marketplace is determined by the domain name of said marketplace. For instance, `https://www.walmart.com/` becomes `walmart` where the UUID is `sha256hash(walmart)`

---

## Vinegar extension

TBD lmao :3