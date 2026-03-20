"use client";

import { api } from "@/lib/axios";

export interface PrintInvoiceData {
  orderId: string;
  customerName?: string;
  table?: number;
  items: Array<{
    quantity: number;
    productName?: string;
    product?: { name?: string };
    unitPrice?: number;
    price?: number;
    totalPrice?: number;
  }>;
  total: number;
  paidAt?: string;
  createdAt?: string;
  status: string;
  type?: string;
}

/**
 * Thermal Printer Service
 * Handles direct printing to thermal printers via kitchen-printer backend
 * No print dialogs - silent printing
 */
export class ThermalPrinterService {
  /**
   * Print invoice directly to thermal printer
   * Sends to backend which communicates with kitchen-printer app
   */
  static async printInvoice(data: PrintInvoiceData): Promise<boolean> {
    try {
      const response = await api.post("/print/invoice", {
        orderId: data.orderId,
        customerName: data.customerName,
        table: data.table,
        items: data.items,
        total: data.total,
        paidAt: data.paidAt,
        status: data.status,
        type: data.type,
        isPrinted: true,
      });

      return response.status === 200;
    } catch (error: any) {
      console.error("Print error:", error);
      throw new Error(
        error.response?.data?.message || "Error al imprimir factura"
      );
    }
  }

  /**
   * Print order (to kitchen)
   * Automatic kitchen printer - no user intervention
   */
  static async printOrder(data: PrintInvoiceData): Promise<boolean> {
    try {
      const response = await api.post("/print/order", {
        orderId: data.orderId,
        customerName: data.customerName,
        items: data.items,
        total: data.total,
        paidAt: data.paidAt,
        status: data.status,
        type: data.type,
      });

      return response.status === 200;
    } catch (error: any) {
      console.error("Order print error:", error);
      return false; // Silently fail for kitchen orders
    }
  }

  /**
   * Check if printer is available
   */
  static async checkPrinterStatus(): Promise<boolean> {
    try {
      const response = await api.get("/print/status", { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export default ThermalPrinterService;
