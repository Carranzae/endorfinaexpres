const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// =====================================================
//  CONFIGURACION — Ajusta con tus credenciales admin
// =====================================================
const API_URL = 'https://endorfinaexpres-production.up.railway.app'; // Puerto del backend NestJS
const ADMIN_EMAIL = 'pedrocarranzaescobedo001@gmail.com';
const ADMIN_PASSWORD = 'CaRrA06Rz+';
const CHECK_INTERVAL_MS = 5000;
const RETRY_LOGIN_MS = 10000;                   // Reintentar login cada 10s si falla

// =====================================================
// ESTADO INTERNO
// =====================================================
let jwtToken = null;
let loginInterval = null;
let pollInterval = null;

// Evitar imprimir dos veces a lo loco
const printedOrders = new Set(); 
let isProcessing = false;

console.log('==============================================');
console.log(' 🖨️  SERVICIO DE IMPRESION INTELIGENTE');
console.log('     ENDORFINA EXPRESS (NEO-TOKYO)');
console.log('==============================================');
console.log(`API: ${API_URL}`);

// Detectar impresoras disponibles
exec('powershell -Command "Get-Printer | Select-Object Name, PrinterStatus | Format-Table -HideTableHeaders"', (err, stdout) => {
  if (!err && stdout.trim()) {
    console.log('\n--- Impresoras Detectadas en este Equipo ---');
    console.log(stdout.trim());
    console.log('--------------------------------------------\n');
    console.log('Por defecto se usará la impresora predeterminada del sistema.');
    console.log('Si deseas usar una específica, modifica la función printReceipt en el código.\n');
  }
});

console.log('Esperando conexion con el servidor...');
console.log('');

// ── Login para obtener JWT ──────────────────────────
async function login() {
  try {
    console.log(`[INFO] Conectando a ${API_URL}/auth/login ...`);
    const res = await axios.post(
      `${API_URL}/auth/login`,
      { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      { timeout: 5000 }
    );
    const token = res.data.access_token || res.data.token;
    if (token) {
      jwtToken = token;
      console.log('✅ ¡Conectado exitosamente al servidor ERP!');
      console.log(`⏱️  Buscando pedidos nuevos cada ${CHECK_INTERVAL_MS / 1000} segundos...\n`);
      return true;
    } else {
      console.error('❌ Login exitoso pero no se recibio token. Respuesta:', JSON.stringify(res.data));
      return false;
    }
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) {
      console.error('❌ Credenciales incorrectas. Edita ADMIN_EMAIL y ADMIN_PASSWORD en print_service.js');
    } else if (status === 404) {
      console.error(`❌ [404] La ruta /auth/login no fue encontrada en ${API_URL}`);
      console.error('        Verifica que el backend este corriendo.');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
      console.error(`❌ No se puede conectar a ${API_URL}`);
      console.error('   El backend NO esta corriendo. Inícialo primero.');
    } else {
      console.error(`❌ Fallo de conexion (${error.code || status || error.message})`);
    }
    console.error(`   Reintentando en ${RETRY_LOGIN_MS / 1000} segundos...\n`);
    return false;
  }
}

// ── Headers autenticados ────────────────────────────
function authHeaders() {
  return { Authorization: `Bearer ${jwtToken}` };
}

// ── Obtener pedidos no impresos ─────────────────────
async function fetchUnprintedOrders() {
  try {
    const res = await axios.get(`${API_URL}/orders/unprinted/all`, {
      headers: authHeaders(),
      timeout: 5000,
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) {
      console.log('⚠️ Token expirado, reconectando...');
      jwtToken = null;
      await tryLogin();
    } else if (status) {
      console.error(`❌ [H-${status}] Error al obtener pedidos:`, error.response?.data?.message || error.message);
    } else {
      console.error('❌ Perdida de conexion con el servidor:', error.message);
    }
    return [];
  }
}

// ── Marcar pedido como impreso ──────────────────────
async function markOrderAsPrinted(orderId) {
  try {
    await axios.patch(`${API_URL}/orders/${orderId}/printed`, {}, {
      headers: authHeaders(),
      timeout: 5000,
    });
  } catch (error) {
    console.error(`❌ No se pudo marcar el pedido ${orderId} como impreso en el servidor:`, error.message);
  }
}

// ── Generador de Tickets (Ancho fijo térmico) ───────
function padRight(str, length) {
  return str.length > length ? str.substring(0, length) : str.padEnd(length, ' ');
}

function padLeft(str, length) {
  return str.length > length ? str.substring(0, length) : str.padStart(length, ' ');
}

function createReceiptText(order) {
  const WIDTH = 48; // Ancho estandar para impresoras térmicas de 80mm
  const separator = ''.padEnd(WIDTH, '=') + '\n';
  const dashLine = ''.padEnd(WIDTH, '-') + '\n';
  
  let text = '';
  // Logo ascii o texto centrado
  const title = "ENDORFINA EXPRESS";
  text += padLeft(title, Math.floor((WIDTH + title.length) / 2)) + '\n';
  const subtitle = "NEO-TOKYO TASTE";
  text += padLeft(subtitle, Math.floor((WIDTH + subtitle.length) / 2)) + '\n';
  text += separator;
  
  text += `PEDIDO #${order.id.slice(-6).toUpperCase()}\n`;
  text += `FECHA: ${new Date(order.createdAt).toLocaleString('es-PE')}\n`;
  text += `CLIENTE: ${order.customerName.toUpperCase()}\n`;
  const typeStr = order.table ? `MESA: ${order.table.number}` : `TIPO: ${order.orderType}`;
  text += typeStr + '\n';
  text += dashLine;
  
  if (order.items && order.items.length > 0) {
    text += padRight("DESCRIPCION", WIDTH - 12) + padLeft("TOTAL", 12) + '\n';
    text += dashLine;
    
    order.items.forEach(item => {
      const prodName = item.product?.title || item.product?.name || 'Producto';
      const qtyStr = `${item.quantity}x `;
      const subtotalStr = `S/ ${Number(item.totalPrice).toFixed(2)}`;
      
      const lineLeft = padRight(qtyStr + prodName, WIDTH - 12);
      const lineRight = padLeft(subtotalStr, 12);
      text += lineLeft + lineRight + '\n';
      
      if (item.notes) {
        text += `  *Nota: ${item.notes}*\n`;
      }
    });
  } else {
    text += `(Sin detalles)\n`;
  }
  text += dashLine;
  
  const totalStr = `TOTAL: S/ ${Number(order.total).toFixed(2)}`;
  text += padLeft(totalStr, WIDTH) + '\n';
  text += separator;
  
  const thanks = "¡GRACIAS POR TU COMPRA!";
  text += '\n' + padLeft(thanks, Math.floor((WIDTH + thanks.length) / 2)) + '\n\n\n\n\n';
  
  return text;
}

// ── Imprimir ticket a POS conectada/default ─────────
function printReceipt(text) {
  return new Promise((resolve) => {
    const filePath = path.join(__dirname, 'temp_receipt.txt');
    fs.writeFileSync(filePath, text, { encoding: 'utf8' });

    // ═══════════════════════════════════════════════════
    // 🔥 BRUTE FORCE WIN32 NATIVE PRINT (Bypass Out-Printer Bug)
    // Busca la impresora por defecto (Default=$true)
    // ═══════════════════════════════════════════════════
    const psScript = `
$defaultPrinter = (Get-WmiObject -Query "SELECT * FROM Win32_Printer WHERE Default=True").Name
if (-not $defaultPrinter) { throw "No hay impresora predeterminada." }

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
$success = [RawPrinterHelper]::SendStringToPrinter($defaultPrinter, $text)
if (-not $success) { throw "Fallo de impresion API WIN32" }
`;

    const scriptPath = path.join(__dirname, 'print_raw.ps1');
    fs.writeFileSync(scriptPath, psScript, { encoding: 'utf8' });

    exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, { timeout: 15000 }, (error) => {
      if (error) {
        console.error(`❌ Error Nativo de Impresora: ${error.message}`);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

// ── Loop de pedidos ─────────────────────────────────
async function processOrders() {
  if (!jwtToken || isProcessing) return;
  isProcessing = true; // Bloqueo de concurrencia

  try {
    const orders = await fetchUnprintedOrders();

    if (orders.length > 0) {
      console.log(`\n[📦] ${orders.length} pedido(s) pendientes...`);
      for (const order of orders) {
        if (printedOrders.has(order.id)) {
          // Ya lo imprimimos en memoria, parchear de nuevo.
          await markOrderAsPrinted(order.id);
          continue;
        }

        console.log(`  --> Imprimiendo pedido: #${order.id.slice(-6).toUpperCase()} (${order.customerName})`);
        
        // Lo añadimos a la memoria ANTES de imprimir para evitar cualquier raza de concurrencia accidental extra.
        printedOrders.add(order.id); 
        
        const text = createReceiptText(order);
        const success = await printReceipt(text);
        
        if (success) {
          await markOrderAsPrinted(order.id);
          console.log(`  ✅ Ticket encolado en cola térmica.`);
        } else {
          // Si falló la impresión, lo quitamos para reintentar la próxima.
          printedOrders.delete(order.id);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error en processOrders:", error);
  } finally {
    isProcessing = false; // Liberar bloqueo
  }
}

// ── Intento de login con reintento automático ───────
async function tryLogin() {
  if (loginInterval) { clearInterval(loginInterval); loginInterval = null; }
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }

  const success = await login();
  if (success) {
    processOrders();
    pollInterval = setInterval(processOrders, CHECK_INTERVAL_MS);
  } else {
    loginInterval = setInterval(async () => {
      const ok = await login();
      if (ok) {
        clearInterval(loginInterval);
        loginInterval = null;
        processOrders();
        pollInterval = setInterval(processOrders, CHECK_INTERVAL_MS);
      }
    }, RETRY_LOGIN_MS);
  }
}

// ── Arranque ────────────────────────────────────────
tryLogin();
