import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';

interface PrintInvoiceData {
  orderId: string;
  customerName?: string;
  table?: string;
  items?: any[];
  total?: number;
  paidAt?: string;
  status?: string;
  type?: string;
  isPrinted?: boolean;
}

@Injectable()
export class PrintService {
  private readonly logger = new Logger('PrintService');
  private pendingInvoices: any[] = []; // In-memory queue for manual invoice prints

  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  /**
   * Print Invoice Handler
   * Called from frontend when user clicks "Print" button
   * Marks order as printed and notifies all clients
   */
  async printInvoice(data: PrintInvoiceData): Promise<{ success: boolean; message: string }> {
    try {
      const { orderId } = data;

      if (!orderId) {
        this.logger.warn('Print invoice request without orderId');
        return { success: false, message: 'Order ID is required' };
      }

      // Update order as printed in database
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          isPrinted: true,
          printedAt: new Date(),
          status: 'READY', // Mark as ready if not already
        },
        include: {
          items: true,
          table: true,
          user: true,
        },
      });

      // Add to in-memory queue so the kitchen-printer can poll it
      this.pendingInvoices.push({
        ...data,
        id: updatedOrder.id, // ensure id is present for kitchen printer
        createdAt: new Date().toISOString(),
        isInvoiceRequest: true
      });

      this.logger.log(`✅ Invoice #${orderId.slice(-6)} queued for physical printer successfully`);

      // Broadcast to all connected clients (POS dashboard)
      this.eventsGateway.server.emit('invoice-printed', {
        orderId: updatedOrder.id,
        customerName: updatedOrder.customerName,
        total: updatedOrder.total,
        timestamp: new Date(),
      });

      return {
        success: true,
        message: `Invoice #${orderId.slice(-6)} printed successfully`,
      };
    } catch (error) {
      this.logger.error(`Failed to print invoice: ${error.message}`);
      return {
        success: false,
        message: `Failed to print invoice: ${error.message}`,
      };
    }
  }

  /**
   * Print Order Handler
   * Called from the thermal printer app to print kitchen orders
   * This keeps track of orders sent to kitchen-printer
   */
  async printOrder(data: PrintInvoiceData): Promise<{ success: boolean; message: string }> {
    try {
      const { orderId } = data;

      if (!orderId) {
        this.logger.warn('Print order request without orderId');
        return { success: false, message: 'Order ID is required' };
      }

      // Just confirm the request; kitchen-printer handles actual printing
      this.logger.log(`📄 Order #${orderId.slice(-6)} sent to printer`);

      return {
        success: true,
        message: `Order #${orderId.slice(-6)} sent to printer`,
      };
    } catch (error) {
      this.logger.error(`Failed to send order to printer: ${error.message}`);
      return {
        success: false,
        message: `Failed to send order to printer: ${error.message}`,
      };
    }
  }

  /**
   * Print Status Handler
   * Returns printer availability status
   * The kitchen-printer app polls this endpoint
   */
  async getPrintStatus(): Promise<{
    available: boolean;
    status: string;
    message: string;
    timestamp: string;
  }> {
    try {
      // Check if there's a recent health check from kitchen-printer
      // For now, assume printer is available if backend is running
      return {
        available: true,
        status: 'READY',
        message: 'Printer is available and ready for printing',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error checking printer status: ${error.message}`);
      return {
        available: false,
        status: 'ERROR',
        message: `Printer status check failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get unprinted orders (for kitchen-printer polling)
   * Used by the Electron app to fetch orders that need to be printed
   */
  async getUnprintedOrders(): Promise<any[]> {
    try {
      const unprintedOrders = await this.prisma.order.findMany({
        where: {
          isPrinted: false,
          status: { in: ['READY', 'PREPARING'] },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          table: true,
          user: true,
        },
        orderBy: { createdAt: 'asc' },
        take: 10, // Limit to 10 most recent unprinted orders
      });

      return unprintedOrders;
    } catch (error) {
      this.logger.error(`Failed to fetch unprinted orders: ${error.message}`);
      return [];
    }
  }

  /**
   * Get unprinted manual invoices (for kitchen-printer polling)
   * This queue is filled when the user manually clicks "Print Invoice"
   */
  async getUnprintedInvoices(): Promise<any[]> {
    try {
      if (this.pendingInvoices.length === 0) return [];
      
      // Clone and empty the queue atomically
      const invoicesToPrint = [...this.pendingInvoices];
      this.pendingInvoices = [];
      
      this.logger.log(`📤 Sending ${invoicesToPrint.length} manual invoices to printer`);
      return invoicesToPrint;
    } catch (error) {
      this.logger.error(`Failed to fetch unprinted invoices: ${error.message}`);
      return [];
    }
  }

  /**
   * Mark order as printed
   * Called by kitchen-printer after successful printing
   */
  async markAsPrinted(orderId: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          isPrinted: true,
          printedAt: new Date(),
        },
      });

      this.logger.log(`✅ Order #${orderId.slice(-6)} marked as printed`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to mark order as printed: ${error.message}`);
      return { success: false };
    }
  }
}
