const os = require('os');
const { setCors } = require('./_utils');

module.exports = function (req, res) {
    setCors(res);
    const start = Date.now();
    res.status(200).json({
        status: "Online",
        cpu_usage: os.loadavg(),
        memory_usage: process.memoryUsage().heapUsed / 1024 / 1024 + ' MB',
        latency: (Date.now() - start) + 'ms'
    });
};