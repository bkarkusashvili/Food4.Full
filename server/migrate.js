const path = require('path'),
    db = require('./db'),
    config = require('./config');

async function start() {
    let migrationFile = process.argv[2];

    if (!migrationFile) {
        console.error("Migration file not specified!");
        return process.exit(1);
    }

    migrationFile = path.join(__dirname, migrationFile);

    let migrationScript;

    try {
        migrationScript = require(migrationFile);
    } catch (e) {
        console.error("Error loading migration file", e);
        return process.exit(1);
    }

    if (typeof migrationScript !== 'function') {
        console.error("Migration file invalid, no default function exported!");
        console.error("module.exports = function(db) { ... }");
        return process.exit(1);
    }

    await db.connect(config.mongoose.url);
    let migrationResult = migrationScript(db);

    if (migrationResult.then) {
        migrationResult.then(() => {
            console.log("Migration completed!");
            process.exit(0);
        }).catch((error) => {
            console.error("Migration error:", error);
            process.exit(1);
        });
    }
}

start();