const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./donations.db');

db.serialize(() => {
    db.run("ALTER TABLE volunteers ADD COLUMN email TEXT", (err) => {
        if (err) {
            console.log("Column might already exist or error:", err.message);
        } else {
            console.log("Added email column to volunteers table.");
        }
    });
});
db.close();
