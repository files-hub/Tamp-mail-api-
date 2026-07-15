const { readDB, writeDB, logRequest, setCors } = require('./_utils');

module.exports = function (req, res) {
    setCors(res);
    logRequest();

    const { id, token } = req.query; // using query for DELETE to make it simple in REST
    if (!id || !token) return res.status(400).json({ error: "Message ID and Token required" });

    let messages = readDB('messages.json');
    const initialLength = messages.length;
    messages = messages.filter(m => !(m.id === id && m.token === token));

    if (messages.length === initialLength) return res.status(404).json({ error: "Message not found" });

    writeDB('messages.json', messages);
    res.status(200).json({ success: true, message: "Message deleted" });
};
