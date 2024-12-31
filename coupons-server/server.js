const express = require('express');

const sqlite3 = require('sqlite3').verbose();
const DB_NAME = __dirname + '/coupons.db';

const bodyParser = require('body-parser');

const { blake2bHex } = require('blakejs');

const jsonParser = bodyParser.json();

const app = express();
const api = express.Router();
const PORT = 2500;

/**
 * 
 * @param {String} SQL "SQL Query"
 * @param {Any[]} arguments "Query Args"
 * @returns {Number} "Status"
 */
function writeToDB(SQL, arguments) {
    const db = new sqlite3.Database(DB_NAME, (err) => {
        if (err) {
            return console.err(err.message);
        }
    });

    db.run(SQL, arguments, (err) => {
        if (err) {
            return 500;
        }
    });

    db.close();
    return 200;
}

api.post('/addcoupon', jsonParser, (req, res) => {
    var { code, marketplace, expiration_date } = req.body;

    if (!Number(expiration_date)) { // Sets expiration date if it is null or NaN
        expiration_date = Math.round(Date.now() / 1000) + (30 * 24 * 3600); // Sets expiration date to 1 month from now
    }
    var deletion_date = Number(expiration_date) + (30 * 24 * 3600); // Sets deletion date to 1 month from expiration date
    var marketplace_uuid = blake2bHex(marketplace); // sha256 hashes the marketplace domain name (e.g. `www.walmart.com`)

    var MarketplacesSQL = `INSERT OR REPLACE INTO Marketplaces(marketplace_uuid, marketplace_name) VALUES(?, ?);`
    let MarketplacesStatus = writeToDB(MarketplacesSQL, [marketplace_uuid, marketplace]);

    var CouponsSQL = `INSERT OR REPLACE INTO Coupons(code, marketplace, expiration_date, deletion_date) VALUES(?, ?, ?, ?);`
    let CouponsStatus = writeToDB(CouponsSQL, [code, marketplace_uuid, Number(expiration_date), deletion_date]);

    var retStatus = ((MarketplacesStatus + CouponsStatus) === 400) ? 200 : 500;

    res.status(retStatus);
    res.json({ "status": retStatus });
});

api.post('/mirror', jsonParser, (req, res) => {
    console.log(req.body);
    res.status(200);
    res.json({ "json": req.body });
})

app.use('/api', api);

app.listen(PORT, () => {
    console.log("app listening on port 2500 of localhost");
})