// ═══════════════════════════════════════════════
//  RENDERER JS — Kitchen Printer UI Logic
// ═══════════════════════════════════════════════

let isConnected = false;
let selectedPrinter = '';
let currentPaperWidth = '80mm';

// ── Load saved config on startup ───────────────
window.addEventListener('DOMContentLoaded', async () => {
    const cfg = await window.api.getConfig();
    if (cfg.config.apiUrl) document.getElementById('apiUrl').value = cfg.config.apiUrl;
    if (cfg.config.email) document.getElementById('email').value = cfg.config.email;
    if (cfg.config.password) document.getElementById('password').value = cfg.config.password;
    if (cfg.selectedPrinter) selectedPrinter = cfg.selectedPrinter;
    if (cfg.paperWidth) {
        currentPaperWidth = cfg.paperWidth;
        updatePaperUI();
    }
});

// ── Connect / Disconnect ───────────────────────
async function connect() {
    const apiUrl = document.getElementById('apiUrl').value.trim().replace(/\/$/, '');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!apiUrl || !email || !password) { addLog('⚠️ Completa todos los campos'); return; }
    document.getElementById('btnConnect').disabled = true;
    document.getElementById('btnConnect').textContent = '⏳ Conectando...';
    await window.api.connect({ apiUrl, email, password });
    document.getElementById('btnConnect').disabled = false;
    document.getElementById('btnConnect').textContent = '🔌 Conectar';
}

async function disconnect() {
    await window.api.disconnect();
}

// ── Printers ───────────────────────────────────
async function refreshPrinters() {
    document.getElementById('printerList').innerHTML = '<div style="color:#5a5a7a;font-size:12px;text-align:center;padding:10px">🔄 Buscando impresoras...</div>';
    await window.api.refreshPrinters();
}

function renderPrinters(printers) {
    const el = document.getElementById('printerList');
    if (!printers || printers.length === 0) {
        el.innerHTML = '<div style="color:#5a5a7a;font-size:12px;text-align:center;padding:10px">No se detectaron impresoras</div>';
        return;
    }
    el.innerHTML = printers.map(p => {
        const typeClass = p.connectionType === 'WiFi' ? 'type-wifi' : p.connectionType === 'Bluetooth' ? 'type-bluetooth' : 'type-usb';
        const isSelected = selectedPrinter === p.name;
        return `<div class="printer-item ${isSelected ? 'selected' : ''}" onclick="selectPrinter('${p.name.replace(/'/g, "\\'")}')">
            <span class="name">${p.name}</span>
            <span class="type-badge ${typeClass}">${p.connectionType}</span>
            ${isSelected ? '<span style="color:#7c3aed;font-size:11px;font-weight:700">✓ Activa</span>' : ''}
        </div>`;
    }).join('');
}

async function selectPrinter(name) {
    selectedPrinter = name;
    await window.api.setPrinter(name);
    // Refresh UI
    const el = document.getElementById('printerList');
    el.querySelectorAll('.printer-item').forEach(item => {
        const itemName = item.querySelector('.name').textContent;
        item.classList.toggle('selected', itemName === name);
    });
    // Re-render to show checkmark
    await window.api.refreshPrinters();
}

// ── Paper Width ────────────────────────────────
async function setPaperWidth(width) {
    currentPaperWidth = width;
    updatePaperUI();
    await window.api.setPaperWidth(width);
}

function updatePaperUI() {
    document.getElementById('paper80').classList.toggle('selected', currentPaperWidth === '80mm');
    document.getElementById('paper58').classList.toggle('selected', currentPaperWidth === '58mm');
}

// ── Test Print ─────────────────────────────────
async function testPrint() {
    await window.api.testPrint();
}

// ── Logs ───────────────────────────────────────
function addLog(msg) {
    const box = document.getElementById('logBox');
    const time = new Date().toLocaleTimeString('es-PE');
    box.innerHTML += `<div class="log-line">[${time}] ${msg}</div>`;
    box.scrollTop = box.scrollHeight;
    // Keep only last 50 lines
    const lines = box.querySelectorAll('.log-line');
    if (lines.length > 50) lines[0].remove();
}

// ── IPC Listeners ──────────────────────────────
window.api.onLog(msg => addLog(msg));

window.api.onConnected(val => {
    isConnected = val;
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    dot.classList.toggle('connected', val);
    text.textContent = val ? '🟢 Conectado — Escuchando pedidos' : '🔴 Desconectado';
    text.style.color = val ? '#22c55e' : '#ef4444';
    document.getElementById('btnConnect').style.display = val ? 'none' : 'flex';
    document.getElementById('btnDisconnect').style.display = val ? 'flex' : 'none';
});

window.api.onPrintersDetected(printers => renderPrinters(printers));
window.api.onPendingCount(n => document.getElementById('pendingCount').textContent = n);
window.api.onPrintedCount(n => document.getElementById('printedCount').textContent = n);
