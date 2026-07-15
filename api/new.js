const crypto = require('crypto');
const { readDB, writeDB, logRequest, setCors, config } = require('./_utils');

const TLDS = ['.com', '.net', '.org', '.xyz', '.cc', '.io', '.in', '.live', '.site', '.online'];

const randomStr = (min, max) => {
    const len = Math.floor(Math.random() * (max - min + 1)) + min;
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({length: len}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

module.exports = function (req, res) {
    setCors(res);
    logRequest();
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const emails = readDB('emails.json');
    let username = req.query.username ? req.query.username.toLowerCase() : randomStr(5, 12);
    
    const domain = randomStr(4, 10) + TLDS[Math.floor(Math.random() * TLDS.length)];
    const fullEmail = `${username}@${domain}`;

    if (req.query.username && emails.some(e => e.username === username)) {
        return res.status(400).json({ error: "Username already exists" });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const createdTime = Date.now();
    const expiryTime = createdTime + (config.MAIL_EXPIRE_TIME * 60 * 60 * 1000);

    const newEmail = { email: fullEmail, username, domain, token, createdTime, expiryTime };
    emails.push(newEmail);
    writeDB('emails.json', emails);

    // Update stats
    const stats = readDB('stats.json');
    stats.total_generated = (stats.total_generated || 0) + 1;
    stats.active_emails = emails.length;
    writeDB('stats.json', stats);

    // Create a simulation welcome message to test the OTP/Inbox feature
    const messages = readDB('messages.json');
    messages.push({
        id: crypto.randomBytes(8).toString('hex'),
        token: token,
        sender: "welcome@codeify.api",
        receiver: fullEmail,
        subject: "Welcome to " + config.API_NAME,
        preview: "Your verification code is 482193",
        text: "Hello! Thanks for using our temporary mail API. Your verification code is 482193.",
        html: "<p>Hello! Thanks for using our temporary mail API. Your verification code is <strong>482193</strong>.</p>",
        attachments: [],
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
    });
    writeDB('messages.json', messages);

    res.status(200).json(newEmail);
};