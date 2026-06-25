import { Chess, type Move, type Square } from "chess.js";
import {
  applyMove,
  clockPresets,
  createInitialSnapshot,
  type GameMode,
  type GameSnapshot,
} from "@xadrez/shared";

export type BoardPiece = { square: string; type: string; color: "w" | "b" };

export function piecesFromFen(fen: string): BoardPiece[] {
  const chess = new Chess(fen);
  const pieces: BoardPiece[] = [];
  chess.board().forEach((rank, rankIndex) => {
    rank.forEach((piece, fileIndex) => {
      if (!piece) return;
      pieces.push({
        square: toSquare(fileIndex, rankIndex),
        type: piece.type,
        color: piece.color,
      });
    });
  });
  return pieces;
}

export function legalTargets(fen: string, square: string): string[] {
  const chess = new Chess(fen);
  return chess
    .moves({ square: square as Square, verbose: true })
    .map((move) => String(move.to));
}

export function createLocalGame(mode: GameMode = "computer") {
  return createInitialSnapshot(crypto.randomUUID(), mode, clockPresets[0]!);
}

export function playLocalMove(
  snapshot: GameSnapshot,
  move: { from: string; to: string; promotion?: string },
) {
  return applyMove(snapshot, {
    gameId: snapshot.id,
    from: move.from,
    to: move.to,
    promotion: move.promotion as "q" | "r" | "b" | "n" | undefined,
    whiteTimeLeft: snapshot.whiteTimeLeft,
    blackTimeLeft: snapshot.blackTimeLeft,
  });
}

export function moveFromUci(
  fen: string,
  uci: { from: string; to: string; promotion?: string },
): Move | null {
  const chess = new Chess(fen);
  return chess.move({
    from: uci.from as Square,
    to: uci.to as Square,
    promotion: uci.promotion,
  });
}

export function toSquare(fileIndex: number, rankIndex: number) {
  const file = "abcdefgh"[fileIndex];
  const rank = 8 - rankIndex;
  return `${file}${rank}`;
}
