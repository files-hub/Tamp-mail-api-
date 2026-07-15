let currentEmail = localStorage.getItem('tmp_email');
let currentToken = localStorage.getItem('tmp_token');

async function init() {
    const res = await fetch('/api/status');
    const data = await res.json();
    
    document.querySelectorAll('.brand').forEach(e => e.innerText = data.api_name);
    if(document.getElementById('foot-name')) {
        document.getElementById('foot-name').innerText = data.api_name;
        document.getElementById('foot-dev').innerText = data.developer_name;
        document.getElementById('foot-tg').innerText = data.telegram_username;
        document.getElementById('foot-ver').innerText = data.version;
    }

    if(document.getElementById('email-display')) {
        if (!currentEmail || !currentToken) {
            generateNew();
        } else {
            document.getElementById('email-display').value = currentEmail;
            fetchInbox();
            setInterval(fetchInbox, 3000); // Auto refresh every 3 seconds
        }
    }
}

async function generateNew(username = '') {
    const url = username ? `/api/new?username=${username}` : '/api/new';
    const res = await fetch(url);
    const data = await res.json();
    if(data.error) return alert(data.error);
    
    currentEmail = data.email;
    currentToken = data.token;
    localStorage.setItem('tmp_email', currentEmail);
    localStorage.setItem('tmp_token', currentToken);
    document.getElementById('email-display').value = currentEmail;
    
    document.getElementById('otp-section').style.display = 'none';
    fetchInbox();
}

async function generateCustom() {
    const uname = prompt("Enter custom username:");
    if(uname) generateNew(uname);
}

async function fetchInbox() {
    if(!currentToken) return;
    const res = await fetch(`/api/inbox?token=${currentToken}`);
    const data = await res.json();
    
    document.getElementById('msg-count').innerText = `(${data.total_messages})`;
    const list = document.getElementById('inbox-list');
    
    if(data.total_messages === 0) {
        list.innerHTML = '<p style="text-align:center; color:#888;">No messages yet.</p>';
        return;
    }

    list.innerHTML = '';
    data.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'msg-item';
        div.innerHTML = `
            <div>
                <h4>${msg.subject}</h4>
                <p style="font-size:0.9rem; color:#aaa;">From: ${msg.sender}</p>
            </div>
            <span style="font-size:0.8rem; color:#888;">${msg.time}</span>
        `;
        div.onclick = () => readMessage(msg.id);
        list.appendChild(div);
    });
}

async function readMessage(id) {
    const res = await fetch(`/api/message?id=${id}&token=${currentToken}`);
    const msg = await res.json();
    
    if(msg.otp_detected) {
        document.getElementById('otp-section').style.display = 'block';
        document.getElementById('otp-display').innerText = msg.otp;
    }
    alert(`Subject: ${msg.subject}\n\n${msg.text}`);
}

async function clearInbox() {
    if(!confirm("Are you sure?")) return;
    await fetch(`/api/delete-all?token=${currentToken}`, { method: 'DELETE' });
    fetchInbox();
}

function copyEmail() {
    navigator.clipboard.writeText(currentEmail);
    showToast();
}

function copyOTP() {
    const otp = document.getElementById('otp-display').innerText;
    navigator.clipboard.writeText(otp);
    showToast();
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

window.onload = init;