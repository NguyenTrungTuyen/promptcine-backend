import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { INestApplication, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class JobStatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private static instance: JobStatusGateway;

  constructor() {
    JobStatusGateway.instance = this;
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  static emitJobStatusUpdate(jobId: string, payload: any) {
    if (JobStatusGateway.instance?.server) {
      JobStatusGateway.instance.server.emit(`job:${jobId}`, payload);
    }
  }
}


export function setupWebSocketAdapter(app: INestApplication) {
  app.useWebSocketAdapter(new IoAdapter(app));
  Logger.log('✅ WebSocket adapter initialized', 'WebSocket');
}
