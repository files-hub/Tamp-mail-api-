const os = require('os');
const { readDB, setCors, config } = require('./_utils');

module.exports = function (req, res) {
    setCors(res);
    const stats = readDB('stats.json');
    const emails = readDB('emails.json');
    const messages = readDB('messages.json');

    res.status(200).json({
        api_name: config.API_NAME,
        version: config.VERSION,
        developer_name: config.DEVELOPER_NAME,
        telegram_username: config.TELEGRAM_USERNAME,
        server_status: "Online",
        uptime: os.uptime(),
        total_generated_emails: stats.total_generated || 0,
        active_emails: emails.length,
        total_messages: messages.length,
        total_requests: stats.total_requests || 0,
        memory_usage: process.memoryUsage(),
        current_time: new Date().toISOString()
    });
};