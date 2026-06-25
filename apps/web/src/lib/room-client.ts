import { io, type Socket } from 'socket.io-client';
import type { ClockPreset, GameSnapshot, MoveInput, RoomState } from '@xadrez/shared';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:3000';

export type RoomClient = {
  socket: Socket;
  createRoom(clock: ClockPreset): Promise<RoomState>;
  joinRoom(code: string): Promise<RoomState>;
  sendMove(code: string, move: Omit<MoveInput, 'gameId'>): void;
  onMove(callback: (snapshot: GameSnapshot) => void): () => void;
};

export function createRoomClient(): RoomClient {
  const socket = io(WS_URL, { autoConnect: true, transports: ['websocket', 'polling'] });
  return {
    socket,
    createRoom(clock) {
      return socket.emitWithAck('room:create', { clock }) as Promise<RoomState>;
    },
    joinRoom(code) {
      return socket.emitWithAck('room:join', { code }) as Promise<RoomState>;
    },
    sendMove(code, move) {
      socket.emit('game:move', { code, ...move });
    },
    onMove(callback) {
      socket.on('game:moved', callback);
      return () => socket.off('game:moved', callback);
    },
  };
}
