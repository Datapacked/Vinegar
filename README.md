# Coupons server+etc:

## How to run instance of Coupons server:

`npm install`

`node coupons-server/server.js`

#### or

`$SHELL run.sh` where `$SHELL` is your shell of choice

### API Endpoints:

#### TBD

---

## DB Schema:

### TABLE Coupons

code | marketplace | expiration_date | deletion_date | likes | dislikes
---- | ----------- | --------------- | ------------- | ----- | --------
TEXT NOT NULL PRIMARY KEY | INTEGER REFERENCES Marketplace(marketplace_id) | INTEGER | INTEGER | INTEGER | INTEGER

### TABLE Marketplaces

marketplace_id | marketplace_name
-------------- | ----------------
INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT | TEXT