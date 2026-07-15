const { readDB, logRequest, setCors } = require('./_utils');

module.exports = function (req, res) {
    setCors(res);
    logRequest();
    
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token is required" });

    const messages = readDB('messages.json');
    const userMessages = messages
        .filter(m => m.token === token)
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(m => ({
            id: m.id,
            sender: m.sender,
            subject: m.subject,
            preview: m.preview,
            time: m.time,
            date: m.date
        }));

    res.status(200).json({
        total_messages: userMessages.length,
        messages: userMessages
    });
};