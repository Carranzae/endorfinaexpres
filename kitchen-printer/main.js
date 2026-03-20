const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let jwtToken = null;
let pollInterval = null;
let loginInterval = null;
const printedOrders = new Set();
let isProcessing = false;

// ═══════════════════════════════════════════════════
//  ELECTRON WINDOW
// ═══════════════════════════════════════════════════
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 520,
        height: 720,
        resizable: false,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        autoHideMenuBar: true,
        title: 'Endorfina Printer',
    });

    mainWindow.loadFile('renderer.html');
}

app.whenReady().then(() => {
    createWindow();
    // Detect printers on startup
    detectPrinters();
    
    // Auto-login if saved config exists
    const savedConfig = store.get('config');
    if (savedConfig?.apiUrl && savedConfig?.email && savedConfig?.password) {
        tryLogin(savedConfig.apiUrl, savedConfig.email, savedConfig.password);
    }
});

app.on('window-all-closed', () => {
    if (pollInterval) clearInterval(pollInterval);
    if (loginInterval) clearInterval(loginInterval);
    app.quit();
});

// ═══════════════════════════════════════════════════
//  PRINTER DETECTION — WiFi, USB, Bluetooth
// ═══════════════════════════════════════════════════
function detectPrinters() {
    exec('powershell -Command "Get-Printer | Select-Object Name, PortName, DriverName, PrinterStatus | ConvertTo-Json"', (err, stdout) => {
        if (err) {
            sendToRenderer('printers-detected', []);
            return;
        }
        try {
            let printers = JSON.parse(stdout.trim());
            if (!Array.isArray(printers)) printers = [printers];
            
            const mapped = printers.map(p => {
                let connectionType = 'USB';
                const port = (p.PortName || '').toLowerCase();
                if (port.includes('ip_') || port.includes('tcp') || port.includes('wsd') || port.match(/\d+\.\d+\.\d+\.\d+/)) {
                    connectionType = 'WiFi';
                } else if (port.includes('bth') || port.includes('bluetooth')) {
                    connectionType = 'Bluetooth';
                } else if (port.includes('usb') || port.includes('lpt')) {
                    connectionType = 'USB';
                }
                return {
                    name: p.Name,
                    port: p.PortName,
                    driver: p.DriverName,
                    status: p.PrinterStatus === 0 ? 'OK' : 'Error',
                    connectionType,
                };
            });
            
            sendToRenderer('printers-detected', mapped);
            store.set('printers', mapped);
        } catch {
            sendToRenderer('printers-detected', []);
        }
    });
}

// ═══════════════════════════════════════════════════
//  LOGIN & AUTH
// ═══════════════════════════════════════════════════
async function tryLogin(apiUrl, email, password) {
    try {
        sendToRenderer('log', `🔄 Conectando a ${apiUrl}...`);
        const res = await axios.post(`${apiUrl}/auth/login`, { email, password }, { timeout: 8000 });
        const token = res.data.access_token || res.data.token;
        if (token) {
            jwtToken = token;
            store.set('config', { apiUrl, email, password });
            sendToRenderer('log', '✅ ¡Conectado exitosamente al servidor!');
            sendToRenderer('connected', true);
            
            // Start polling
            if (pollInterval) clearInterval(pollInterval);
            const interval = store.get('interval') || 5000;
            processOrders(apiUrl);
            pollInterval = setInterval(() => processOrders(apiUrl), interval);
            return true;
        }
        sendToRenderer('log', '❌ No se recibió token. Verifica las credenciales.');
        return false;
    } catch (error) {
        const status = error.response?.status;
        if (status === 401) sendToRenderer('log', '❌ Credenciales incorrectas');
        else if (error.code === 'ECONNREFUSED') sendToRenderer('log', '❌ No se puede conectar al servidor');
        else sendToRenderer('log', `❌ Error: ${error.message}`);
        sendToRenderer('connected', false);
        return false;
    }
}

// ═══════════════════════════════════════════════════
//  RECEIPT GENERATOR — Auto-adjust paper size
//  INVOICE vs ORDER distinction
// ═══════════════════════════════════════════════════
function createReceiptText(order, paperWidth, isInvoice = false) {
    // Width 48 chars for 80mm, 32 chars for 58mm
    const WIDTH = paperWidth === '58mm' ? 32 : 48;
    const padRight = (str, len) => str.length > len ? str.substring(0, len) : str.padEnd(len, ' ');
    const padLeft = (str, len) => str.length > len ? str.substring(0, len) : str.padStart(len, ' ');
    const center = (str) => padLeft(str, Math.floor((WIDTH + str.length) / 2));
    const separator = ''.padEnd(WIDTH, '=') + '\n';
    const dashLine = ''.padEnd(WIDTH, '-') + '\n';

    let text = '';
    text += center('ENDORFINA EXPRESS') + '\n';
    text += center('NEO-TOKYO TASTE') + '\n';
    text += separator;
    
    // Documento type
    const docType = isInvoice ? 'FACTURA' : 'NOTA DE PEDIDO';
    text += center(docType) + '\n';
    text += dashLine;
    
    text += `#${order.id.slice(-6).toUpperCase()}\n`;
    text += `FECHA: ${new Date(order.createdAt).toLocaleString('es-PE')}\n`;
    if (order.customerName) text += `CLIENTE: ${order.customerName.toUpperCase()}\n`;
    if (order.table) text += `MESA: ${order.table.number}\n`;
    else if (order.type) {
        const typeStr = order.type === 'DINE_IN' ? 'EN LOCAL' : order.type === 'TAKEAWAY' ? 'PARA LLEVAR' : 'DELIVERY';
        text += `TIPO: ${typeStr}\n`;
    }
    text += dashLine;

    if (order.items && order.items.length > 0) {
        text += padRight('DESCRIPCION', WIDTH - 12) + padLeft('TOTAL', 12) + '\n';
        text += dashLine;
        order.items.forEach(item => {
            const prodName = (item.product?.title || item.product?.name || item.productName || 'Producto').substring(0, WIDTH - 15);
            const qty = item.quantity || 1;
            const unitPrice = Number(item.unitPrice || item.price || 0);
            const subtotal = (unitPrice * qty).toFixed(2);
            const qtyStr = `${qty}x `;
            const subtotalStr = `S/ ${subtotal}`;
            text += padRight(qtyStr + prodName, WIDTH - 12) + padLeft(subtotalStr, 12) + '\n';
            if (item.notes) text += `  *${item.notes.substring(0, WIDTH - 4)}*\n`;
        });
    }
    text += dashLine;
    text += padLeft(`TOTAL: S/ ${Number(order.total).toFixed(2)}`, WIDTH) + '\n';
    text += separator;
    
    // Status for invoices
    if (isInvoice && order.status === 'DELIVERED') {
        text += center('✓ CANCELADO') + '\n';
        text += separator;
    }
    
    // Footer with contact info
    text += '\n' + center('¡GRACIAS POR CONSUMIR EN') + '\n';
    text += center('ENDORFINA EXPRESS!') + '\n';
    text += dashLine;
    text += center('📞 999 999 999') + '\n';
    text += center('www.endorfina.pe') + '\n';
    text += '\n\n\n\n\n';
    return text;
}

// ═══════════════════════════════════════════════════
//  PRINT — Uses selected printer or default
// ═══════════════════════════════════════════════════
function printReceipt(text, printerName) {
    return new Promise((resolve) => {
        const filePath = path.join(app.getPath('temp'), 'endorfina_receipt.txt');
        // Usar codificación utf8, pero el API RAW lo leerá para la impresora térmica
        fs.writeFileSync(filePath, text, { encoding: 'utf8' });

        if (!printerName) {
            // Fallback si no hay impresora seleccionada
            const command = `powershell -Command "Get-Content '${filePath}' | Out-Printer"`;
            exec(command, { timeout: 15000 }, (error) => {
                if (error && error.killed) sendToRenderer('log', `❌ Error: Timeout al imprimir.`);
                resolve(!error);
            });
            return;
        }

        // ═══════════════════════════════════════════════════
        // 🔥 BRUTE FORCE WIN32 NATIVE PRINT (Bypass Out-Printer Bug)
        // ═══════════════════════════════════════════════════
        const psScript = `
$code = @"
using System;
using System.Runtime.InteropServices;
public class RawPrinterHelper
{
    [DllImport("winspool.Drv", EntryPoint = "OpenPrinterA", ExactSpelling = true, SetLastError = true, CallingConvention = CallingConvention.StdCall, CharSet = CharSet.Ansi)]
    public static extern bool OpenPrinter([MarshalAs(UnmanagedType.LPStr)] string szPrinter, out IntPtr hPrinter, IntPtr pd);
    [DllImport("winspool.Drv", EntryPoint = "ClosePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool ClosePrinter(IntPtr hPrinter);
    [DllImport("winspool.Drv", EntryPoint = "StartDocPrinterA", SetLastError = true, CharSet = CharSet.Ansi, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool StartDocPrinter(IntPtr hPrinter, int level, [In, MarshalAs(UnmanagedType.LPStruct)] DOCINFOA di);
    [DllImport("winspool.Drv", EntryPoint = "EndDocPrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool EndDocPrinter(IntPtr hPrinter);
    [DllImport("winspool.Drv", EntryPoint = "StartPagePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool StartPagePrinter(IntPtr hPrinter);
    [DllImport("winspool.Drv", EntryPoint = "EndPagePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool EndPagePrinter(IntPtr hPrinter);
    [DllImport("winspool.Drv", EntryPoint = "WritePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, int dwCount, out int dwWritten);
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
    public class DOCINFOA { [MarshalAs(UnmanagedType.LPStr)] public string pDocName; [MarshalAs(UnmanagedType.LPStr)] public string pOutputFile; [MarshalAs(UnmanagedType.LPStr)] public string pDataType; }
    public static bool SendStringToPrinter(string szPrinterName, string szString)
    {
        IntPtr pBytes = Marshal.StringToCoTaskMemAnsi(szString);
        IntPtr hPrinter = new IntPtr(0);
        DOCINFOA di = new DOCINFOA();
        bool bSuccess = false;
        di.pDocName = "RAW Document";
        di.pDataType = "RAW";
        if (OpenPrinter(szPrinterName, out hPrinter, IntPtr.Zero))
        {
            if (StartDocPrinter(hPrinter, 1, di))
            {
                if (StartPagePrinter(hPrinter))
                {
                    int dwWritten;
                    bSuccess = WritePrinter(hPrinter, pBytes, szString.Length, out dwWritten);
                    EndPagePrinter(hPrinter);
                }
                EndDocPrinter(hPrinter);
            }
            ClosePrinter(hPrinter);
        }
        Marshal.FreeCoTaskMem(pBytes);
        return bSuccess;
    }
}
"@
Add-Type -TypeDefinition $code
$text = [System.IO.File]::ReadAllText('${filePath}')
$success = [RawPrinterHelper]::SendStringToPrinter('${printerName}', $text)
if (-not $success) { throw "Fallback error" }
`;

        const scriptPath = path.join(app.getPath('temp'), 'print_raw.ps1');
        fs.writeFileSync(scriptPath, psScript, { encoding: 'utf8' });

        exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, { timeout: 15000 }, (error) => {
            if (error) {
                sendToRenderer('log', `❌ Error Nativo de Impresión (Fuerza Bruta): ${error.message}`);
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
}

// ═══════════════════════════════════════════════════
//  ORDER POLLING
// ═══════════════════════════════════════════════════
async function processOrders(apiUrl) {
    if (!jwtToken || isProcessing) return;
    isProcessing = true;

    try {
        const res = await axios.get(`${apiUrl}/orders/unprinted/all`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
            timeout: 8000,
        });
        const orders = Array.isArray(res.data) ? res.data : [];

        if (orders.length > 0) {
            sendToRenderer('log', `📦 ${orders.length} pedido(s) nuevos encontrados`);
            sendToRenderer('pending-count', orders.length);

            const paperWidth = store.get('paperWidth') || '80mm';
            const selectedPrinter = store.get('selectedPrinter') || null;

            for (const order of orders) {
                if (printedOrders.has(order.id)) {
                    await markOrderAsPrinted(apiUrl, order.id);
                    continue;
                }

                printedOrders.add(order.id);
                sendToRenderer('log', `🖨️ Imprimiendo Pedido #${order.id.slice(-6).toUpperCase()}...`);

                const text = createReceiptText(order, paperWidth, false);
                const success = await printReceipt(text, selectedPrinter);

                if (success) {
                    await markOrderAsPrinted(apiUrl, order.id);
                    sendToRenderer('log', `✅ Ticket #${order.id.slice(-6).toUpperCase()} impreso`);
                    sendToRenderer('printed-count', printedOrders.size);
                } else {
                    printedOrders.delete(order.id);
                }
            }
        }
    } catch (error) {
        if (error.response?.status === 401) {
            sendToRenderer('log', '⚠️ Sesión expirada, reconectando...');
            jwtToken = null;
            const config = store.get('config');
            if (config) tryLogin(config.apiUrl, config.email, config.password);
        }
    } finally {
        isProcessing = false;
    }
}

async function markOrderAsPrinted(apiUrl, orderId) {
    try {
        await axios.patch(`${apiUrl}/orders/${orderId}/printed`, {}, {
            headers: { Authorization: `Bearer ${jwtToken}` },
            timeout: 5000,
        });
    } catch {}
}

// ═══════════════════════════════════════════════════
//  IPC HANDLERS (Renderer → Main)
// ═══════════════════════════════════════════════════
ipcMain.handle('connect', async (_, data) => {
    return await tryLogin(data.apiUrl, data.email, data.password);
});

ipcMain.handle('disconnect', () => {
    if (pollInterval) clearInterval(pollInterval);
    jwtToken = null;
    sendToRenderer('connected', false);
    sendToRenderer('log', '🔌 Desconectado');
});

ipcMain.handle('refresh-printers', () => {
    detectPrinters();
});

ipcMain.handle('set-printer', (_, printerName) => {
    store.set('selectedPrinter', printerName);
    sendToRenderer('log', `🖨️ Impresora seleccionada: ${printerName}`);
});

ipcMain.handle('set-paper-width', (_, width) => {
    store.set('paperWidth', width);
    sendToRenderer('log', `📄 Tamaño de papel: ${width}`);
});

ipcMain.handle('set-interval', (_, ms) => {
    store.set('interval', ms);
    if (pollInterval) {
        clearInterval(pollInterval);
        const config = store.get('config');
        if (config && jwtToken) {
            pollInterval = setInterval(() => processOrders(config.apiUrl), ms);
        }
    }
    sendToRenderer('log', `⏱️ Intervalo: cada ${ms / 1000}s`);
});

ipcMain.handle('test-print', async () => {
    const testText = createReceiptText({
        id: 'TEST001234',
        createdAt: new Date().toISOString(),
        customerName: 'PEDIDO DE PRUEBA',
        total: 99.90,
        items: [
            { quantity: 2, product: { name: 'Lomo Saltado' }, totalPrice: 49.80, notes: 'Sin cebolla' },
            { quantity: 1, product: { name: 'Chicha Morada' }, totalPrice: 8.00 },
        ],
    }, store.get('paperWidth') || '80mm', false);
    
    const selectedPrinter = store.get('selectedPrinter') || null;
    const ok = await printReceipt(testText, selectedPrinter);
    sendToRenderer('log', ok ? '✅ Impresión de prueba exitosa' : '❌ Falló la impresión de prueba');
});

ipcMain.handle('print-invoice', async (_, orderData) => {
    try {
        const paperWidth = store.get('paperWidth') || '80mm';
        const selectedPrinter = store.get('selectedPrinter') || null;
        
        sendToRenderer('log', `📄 Imprimiendo Factura #${orderData.id?.slice(-6)?.toUpperCase() || 'INV'}...`);
        
        const text = createReceiptText(orderData, paperWidth, true);
        const success = await printReceipt(text, selectedPrinter);
        
        if (success) {
            sendToRenderer('log', `✅ Factura #${orderData.id?.slice(-6)?.toUpperCase()} impresa correctamente`);
            return true;
        } else {
            sendToRenderer('log', `❌ Error al imprimir factura`);
            return false;
        }
    } catch (error) {
        sendToRenderer('log', `❌ Error en impresión de factura: ${error.message}`);
        return false;
    }
});

ipcMain.handle('get-config', () => {
    return {
        config: store.get('config') || {},
        paperWidth: store.get('paperWidth') || '80mm',
        selectedPrinter: store.get('selectedPrinter') || '',
        interval: store.get('interval') || 5000,
    };
});

// Helper: send message to renderer
function sendToRenderer(channel, data) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(channel, data);
    }
}
