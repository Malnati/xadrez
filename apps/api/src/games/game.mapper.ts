import type { Game, Move } from '@prisma/client';
import type { ClockPreset, GameSnapshot, MoveRecord } from '@xadrez/shared';

export type GameWithMoves = Game & { moves: Move[] };

export function toSnapshot(game: GameWithMoves): GameSnapshot {
  const moves: MoveRecord[] = [...game.moves]
    .sort((a, b) => a.moveNumber - b.moveNumber)
    .map((move) => ({
      san: move.san,
      from: move.fromSquare,
      to: move.toSquare,
      color: move.color as 'w' | 'b',
      piece: move.piece,
      captured: move.captured ?? undefined,
      promotion: move.promotion ?? undefined,
      fen: move.fen,
      playedAt: move.playedAt.toISOString(),
      whiteTimeLeft: move.whiteTimeLeft,
      blackTimeLeft: move.blackTimeLeft,
    }));

  return {
    id: game.id,
    mode: game.mode,
    fen: game.fen,
    pgn: game.pgn,
    turn: game.fen.includes(' b ') ? 'b' : 'w',
    status: game.status,
    result: game.result,
    moves,
    whiteTimeLeft: game.whiteTimeLeft,
    blackTimeLeft: game.blackTimeLeft,
    clock: game.clock as ClockPreset,
    createdAt: game.createdAt.toISOString(),
    updatedAt: game.updatedAt.toISOString(),
  };
}
