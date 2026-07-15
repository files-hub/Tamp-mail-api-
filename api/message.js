const { readDB, logRequest, setCors } = require('./_utils');

module.exports = function (req, res) {
    setCors(res);
    logRequest();

    const { id, token } = req.query;
    if (!id || !token) return res.status(400).json({ error: "Message ID and Token are required" });

    const messages = readDB('messages.json');
    const msg = messages.find(m => m.id === id && m.token === token);

    if (!msg) return res.status(404).json({ error: "Message not found" });

    // OTP Detection logic
    const otpMatch = msg.text.match(/\b(\d{4}|\d{5}|\d{6}|\d{8})\b/);
    
    res.status(200).json({
        id: msg.id,
        sender: msg.sender,
        receiver: msg.receiver,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
        attachments: msg.attachments,
        time: msg.time,
        date: msg.date,
        otp_detected: !!otpMatch,
        otp: otpMatch ? otpMatch[0] : null
    });
};