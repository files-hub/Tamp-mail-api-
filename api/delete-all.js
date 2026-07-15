const { readDB, writeDB, logRequest, setCors } = require('./_utils');

module.exports = function (req, res) {
    setCors(res);
    logRequest();

    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token is required" });

    let messages = readDB('messages.json');
    messages = messages.filter(m => m.token !== token);
    
    writeDB('messages.json', messages);
    res.status(200).json({ success: true, message: "Inbox cleared" });
};