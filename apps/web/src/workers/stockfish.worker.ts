import { Chess, type Move } from 'chess.js';

type EngineRequest = { id: string; fen: string; depth: number };
type EngineResponse = { id: string; from: string; to: string; promotion?: string; san: string };

self.onmessage = (event: MessageEvent<EngineRequest>) => {
  const { id, fen, depth } = event.data;
  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true });
  const best = chooseMove(chess, moves, depth);
  const response: EngineResponse = { id, from: best.from, to: best.to, promotion: best.promotion, san: best.san };
  self.postMessage(response);
};

function chooseMove(chess: Chess, moves: Move[], depth: number) {
  const scored = moves.map((move) => ({ move, score: scoreMove(chess, move, depth) }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.move ?? moves[0]!;
}

function scoreMove(chess: Chess, move: Move, depth: number) {
  const values: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  let score = move.captured ? values[move.captured] ?? 0 : 0;
  if (move.promotion) score += values[move.promotion] ?? 0;
  const clone = new Chess(chess.fen());
  clone.move({ from: move.from, to: move.to, promotion: move.promotion });
  if (clone.isCheckmate()) score += 100000;
  if (clone.isCheck()) score += 50;
  if (depth > 1) score += Math.random() * 8;
  return score;
}
