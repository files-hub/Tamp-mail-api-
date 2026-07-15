const fs = require('fs');
const path = require('path');
const config = require('../config.js');

const dbPath = (filename) => path.join(__dirname, '..', 'database', filename);

function readDB(filename) {
    try {
        const data = fs.readFileSync(dbPath(filename), 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return filename === 'stats.json' ? {} : [];
    }
}

function writeDB(filename, data) {
    fs.writeFileSync(dbPath(filename), JSON.stringify(data, null, 2));
}

function logRequest() {
    const stats = readDB('stats.json');
    stats.total_requests = (stats.total_requests || 0) + 1;
    writeDB('stats.json', stats);
}

function setCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
}

module.exports = { readDB, writeDB, logRequest, setCors, config };