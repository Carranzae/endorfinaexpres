const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    connect: (data) => ipcRenderer.invoke('connect', data),
    disconnect: () => ipcRenderer.invoke('disconnect'),
    refreshPrinters: () => ipcRenderer.invoke('refresh-printers'),
    setPrinter: (name) => ipcRenderer.invoke('set-printer', name),
    setPaperWidth: (width) => ipcRenderer.invoke('set-paper-width', width),
    setInterval: (ms) => ipcRenderer.invoke('set-interval', ms),
    testPrint: () => ipcRenderer.invoke('test-print'),
    printInvoice: (orderData) => ipcRenderer.invoke('print-invoice', orderData),
    getConfig: () => ipcRenderer.invoke('get-config'),
    
    onLog: (cb) => ipcRenderer.on('log', (_, msg) => cb(msg)),
    onConnected: (cb) => ipcRenderer.on('connected', (_, val) => cb(val)),
    onPrintersDetected: (cb) => ipcRenderer.on('printers-detected', (_, list) => cb(list)),
    onPendingCount: (cb) => ipcRenderer.on('pending-count', (_, n) => cb(n)),
    onPrintedCount: (cb) => ipcRenderer.on('printed-count', (_, n) => cb(n)),
});
