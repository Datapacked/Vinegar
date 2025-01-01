const express = require('express');

const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

const DB_NAME = __dirname + '/coupons.db';

const { blake2bHex } = require('blakejs');

const jsonParser = bodyParser.json();

const api = express.Router();

/**
 * @param {String} SQL "SQL Query"
 * @param {Any[]} arguments "Query Args"
 * @returns {Number} "Status"
 * @description "A function that handles database writing"
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

/**
 * @param {String} SQL "SQL Query"
 * @param {Any[]} args "Query Args"
 * @returns {String} "Query result"
 * @description "A function that handles database reading"
 */
function readFromDB(SQL, args) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_NAME, (err) => {
            if (err) {
                console.error("Database connection error:", err.message);
                return reject(err);
            }
        });

        db.all(SQL, args, (err, rows) => {
            if (err) {
                console.error("Error executing query:", err.message);
                return reject(err);
            }

            const returndata = rows.length === 0
                ? { rows: ["NO_COUPONS_FOUND"] }
                : { rows };
            // console.log("Query result:", returndata);

            resolve(returndata);
        });

        db.close((err) => {
            if (err) {
                console.error("Error closing the database:", err.message);
            }
        });
    });
}

api.post('/addcoupon', jsonParser, (req, res) => {
    var { code, marketplace, expiration_date } = req.body;

    if (!Number(expiration_date)) { // Sets expiration date if it is null or NaN
        expiration_date = Math.round(Date.now() / 1000) + (30 * 24 * 3600); // Sets expiration date to 1 month from now
    }
    var deletion_date = Number(expiration_date) + (30 * 24 * 3600); // Sets deletion date to 1 month from expiration date
    var marketplace_uuid = blake2bHex(marketplace); // sha256 hashes the marketplace domain name (e.g. `www.walmart.com`)

    // The next two pairs of lines write stuff into the database

    var MarketplacesSQL = `INSERT OR REPLACE INTO Marketplaces(marketplace_uuid, marketplace_name) VALUES(?, ?);`
    let MarketplacesStatus = writeToDB(MarketplacesSQL, [marketplace_uuid, marketplace]);

    var CouponsSQL = `INSERT OR REPLACE INTO Coupons(code, marketplace_id, expiration_date, deletion_date) VALUES(?, ?, ?, ?);`
    let CouponsStatus = writeToDB(CouponsSQL, [code, marketplace_uuid, Number(expiration_date), deletion_date]);

    /*
     * Handles returns and status, if either fail, the whole API returns a 5xx error
    */

    var retStatus = ((MarketplacesStatus + CouponsStatus) === 400) ? 200 : 500;

    res.status(retStatus);
    res.json({ "status": retStatus });
});

// Mirrors JSON body back to poster, dunno why this is still here but meh idrc if it stays or goes

api.post('/mirror', jsonParser, (req, res) => {
    console.log(req.body);
    res.status(200);
    res.json({ "json": req.body });
});

// API endpoint for getting coupons

api.get('/coupons', jsonParser, (req, res) => {
    const { marketplace } = req.body;
    const marketplace_id = blake2bHex(marketplace);
    const SQL = `SELECT code FROM Coupons WHERE marketplace_id = ? ORDER BY (likes / MAX(dislikes, 1)), (likes + dislikes) DESC;`;
    const data = readFromDB(SQL, [marketplace_id]); // Returns an array of rows (but only the coupon code) sorted by the ratio of likes to dislikes and the sum of likes and dislikes
    data.then((result) => {
        res.status(200); // Sets status to 200 if nothing breaks
        res.json(result.rows.map(obj => obj.code)); // Converts array of objects of format { "code": COUPON_CODE } to an array containing strings of format [ ... , COUPON_CODE .. ]
    });
});

module.exports = api;