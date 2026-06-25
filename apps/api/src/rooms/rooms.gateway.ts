import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { ClockPreset, MoveInput } from '@xadrez/shared';
import { readEnv } from '../config/env';
import { RoomsService } from './rooms.service';

@WebSocketGateway({ cors: { origin: readEnv().webOrigin, credentials: true } })
export class RoomsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly rooms: RoomsService) {}

  @SubscribeMessage('room:create')
  async create(@MessageBody() body: { hostId?: string; clock?: ClockPreset }, @ConnectedSocket() socket: Socket) {
    const room = await this.rooms.createRoom(body.hostId, body.clock);
    await socket.join(room.code);
    socket.emit('room:created', room);
    return room;
  }

  @SubscribeMessage('room:join')
  async join(@MessageBody() body: { code: string; guestId?: string }, @ConnectedSocket() socket: Socket) {
    const room = await this.rooms.joinRoom(body.code, body.guestId);
    await socket.join(room.code);
    this.server.to(room.code).emit('room:joined', room);
    return room;
  }

  @SubscribeMessage('game:move')
  async move(@MessageBody() body: { code: string } & Omit<MoveInput, 'gameId'>) {
    const snapshot = await this.rooms.move(body.code, body);
    this.server.to(body.code).emit('game:moved', snapshot);
    return snapshot;
  }

  @SubscribeMessage('clock:sync')
  syncClock(@MessageBody() body: { code: string; whiteTimeLeft: number; blackTimeLeft: number }) {
    this.server.to(body.code).emit('clock:synced', body);
    return body;
  }

  @SubscribeMessage('game:resign')
  resign(@MessageBody() body: { code: string; color: 'white' | 'black' }) {
    this.server.to(body.code).emit('game:ended', { result: body.color === 'white' ? 'black' : 'white', reason: 'resign' });
    return { ok: true };
  }
}
