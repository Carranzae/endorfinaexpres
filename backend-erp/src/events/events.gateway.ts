import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // A client could be the React POS or the Headless Print Server
    client.emit('connectionStatus', { status: 'connected', id: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // --- Methods to be called by other Services/Controllers --- //

  broadcastNewOrder(orderData: any) {
    this.logger.log(`Broadcasting new order: ${orderData.id}`);

    // Send to Frontend POS to update UI
    this.server.emit('pos:newOrder', orderData);

    // Send to Local Print Server for automatic kitchen receipt
    this.server.emit('print:kitchen', orderData);
  }

  broadcastOrderStatusChange(orderId: string, status: string) {
    this.server.emit('pos:orderStatusChange', { orderId, status });
  }

  broadcastSunatTicket(data: any) {
    // Send to Local Print Server to print Boleta/Factura
    this.server.emit('print:sunat', data);
  }
}
