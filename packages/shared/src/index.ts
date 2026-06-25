import { Chess, type Move, type Square } from 'chess.js';
import { z } from 'zod';

export const gameModes = ['local', 'room', 'computer'] as const;
export type GameMode = (typeof gameModes)[number];

export const gameStatuses = ['waiting', 'active', 'completed', 'abandoned'] as const;
export type GameStatus = (typeof gameStatuses)[number];

export const gameResults = ['white', 'black', 'draw', 'timeout', 'resigned', 'in_progress'] as const;
export type GameResult = (typeof gameResults)[number];

export type PlayerColor = 'white' | 'black';

export type ClockPreset = {
  id: string;
  label: string;
  initialSeconds: number;
  incrementSeconds: number;
};

export const clockPresets: ClockPreset[] = [
  { id: 'blitz-3-2', label: 'Blitz 3 + 2', initialSeconds: 180, incrementSeconds: 2 },
  { id: 'rapid-10-0', label: 'Rápida 10', initialSeconds: 600, incrementSeconds: 0 },
  { id: 'classic-30-0', label: 'Clássica 30', initialSeconds: 1800, incrementSeconds: 0 },
];

export type MoveRecord = {
  san: string;
  from: string;
  to: string;
  color: 'w' | 'b';
  piece: string;
  captured?: string;
  promotion?: string;
  fen: string;
  playedAt: string;
  whiteTimeLeft: number;
  blackTimeLeft: number;
};

export type GameSnapshot = {
  id: string;
  mode: GameMode;
  fen: string;
  pgn: string;
  turn: 'w' | 'b';
  status: GameStatus;
  result: GameResult;
  moves: MoveRecord[];
  whiteTimeLeft: number;
  blackTimeLeft: number;
  clock: ClockPreset;
  createdAt: string;
  updatedAt: string;
};

export type RoomState = {
  code: string;
  gameId: string;
  hostId: string;
  guestId?: string;
  status: 'open' | 'playing' | 'closed';
  snapshot: GameSnapshot;
};

export const createGameSchema = z.object({
  mode: z.enum(gameModes),
  clock: z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    initialSeconds: z.number().int().min(30).max(10800),
    incrementSeconds: z.number().int().min(0).max(60),
  }),
});

export const moveInputSchema = z.object({
  gameId: z.string().min(1),
  from: z.string().min(2).max(2),
  to: z.string().min(2).max(2),
  promotion: z.enum(['q', 'r', 'b', 'n']).optional(),
  whiteTimeLeft: z.number().int().nonnegative(),
  blackTimeLeft: z.number().int().nonnegative(),
});

export type MoveInput = z.infer<typeof moveInputSchema>;

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60).toString().padStart(2, '0');
  const seconds = (safe % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function createInitialSnapshot(id: string, mode: GameMode, clock: ClockPreset): GameSnapshot {
  const chess = new Chess();
  const now = new Date().toISOString();
  return {
    id,
    mode,
    fen: chess.fen(),
    pgn: chess.pgn(),
    turn: chess.turn(),
    status: mode === 'room' ? 'waiting' : 'active',
    result: 'in_progress',
    moves: [],
    whiteTimeLeft: clock.initialSeconds,
    blackTimeLeft: clock.initialSeconds,
    clock,
    createdAt: now,
    updatedAt: now,
  };
}

export function applyMove(snapshot: GameSnapshot, input: MoveInput): GameSnapshot {
  const chess = new Chess(snapshot.fen);
  const move = chess.move({ from: input.from as Square, to: input.to as Square, promotion: input.promotion });
  if (!move) {
    throw new Error('Movimento inválido');
  }
  const now = new Date().toISOString();
  const result = resolveResult(chess);
  const record = toMoveRecord(move, chess.fen(), now, input.whiteTimeLeft, input.blackTimeLeft);
  return {
    ...snapshot,
    fen: chess.fen(),
    pgn: chess.pgn(),
    turn: chess.turn(),
    status: result === 'in_progress' ? 'active' : 'completed',
    result,
    moves: [...snapshot.moves, record],
    whiteTimeLeft: input.whiteTimeLeft,
    blackTimeLeft: input.blackTimeLeft,
    updatedAt: now,
  };
}

export function resolveResult(chess: Chess): GameResult {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? 'black' : 'white';
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
    return 'draw';
  }
  return 'in_progress';
}

function toMoveRecord(move: Move, fen: string, playedAt: string, whiteTimeLeft: number, blackTimeLeft: number): MoveRecord {
  return {
    san: move.san,
    from: move.from,
    to: move.to,
    color: move.color,
    piece: move.piece,
    captured: move.captured,
    promotion: move.promotion,
    fen,
    playedAt,
    whiteTimeLeft,
    blackTimeLeft,
  };
}
