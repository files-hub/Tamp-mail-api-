# Temporary Mail API

A complete, production-ready Temporary Mail API built with Node.js. 
Includes automatic random domain generation, OTP detection, JSON storage, and a Glassmorphism frontend UI.

## Features
- Custom Usernames & Auto Random Domain Selection
- OTP Extraction (4, 5, 6, 8 digits)
- JSON File Storage
- Auto Refreshing Inbox
- Glassmorphism Dark-Mode UI

## ⚠️ Important Note regarding Production & Email Reception
1. **Vercel Serverless limitations**: This project utilizes local JSON file reading/writing. If deployed on Vercel, files stored in `database/` are ephemeral and will reset. For a true production instance, run this on a standard VPS (DigitalOcean, AWS, Linode) using Node/Express, or replace the JSON `readDB/writeDB` functions with a MongoDB/Redis integration.
2. **Receiving Real Emails**: The API simulates domain generation (`@randomtld.com`). **Only email addresses belonging to domains that are actually configured with valid MX records connected to your specific mail server can receive real internet messages.** 
To receive real emails, you must run an SMTP daemon (like `smtp-server` or `mailin` in Node.js) that intercepts incoming emails for your owned domains and pushes them to `database/messages.json`.