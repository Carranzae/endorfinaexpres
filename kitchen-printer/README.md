# 🖨️ Endorfina Printer — Servicio de Impresión para Cocina

Aplicación de escritorio (Windows) que se conecta al servidor ERP de Endorfina Express y **imprime automáticamente** los pedidos nuevos en la impresora de la cocina.

## ✨ Características

- 🔌 **Auto-conexión** al servidor Railway (o cualquier URL)
- 🖨️ **Detección automática** de impresoras (WiFi, USB, Bluetooth)
- 📦 **Impresión automática** de pedidos cuando llegan a cocina
- 🧾 **Impresión manual** de facturas/boletas bajo demanda
- 📄 **Auto-ajuste** de papel térmico (58mm y 80mm)
- 💾 **Guarda configuración** para no tener que reconectar cada vez
- ⏱️ Polling configurable (cada 5s por defecto)

## 🚀 Instalación para Desarrollo

```bash
cd kitchen-printer
npm install
npm start
```

## 📦 Generar EXE Instalable

```bash
npm run build
```

El instalador `.exe` se genera en la carpeta `dist/` y se puede distribuir a cualquier PC Windows.

## 🔧 Uso

1. **Abre la app** → Ingresa la URL del servidor, email y contraseña del admin
2. **Selecciona impresora** → La app detecta automáticamente todas las impresoras
3. **Elige tamaño de papel** → 80mm (estándar) o 58mm (pequeño)
4. **Haz clic en Conectar** → La app empieza a escuchar pedidos automáticamente
5. **Impresión de prueba** → Verifica que todo funcione antes de operar

## 📋 Requisitos

- Windows 10/11
- Impresora térmica POS (cualquier marca)
- Conexión a Internet (para conectar al servidor)
