import { useCallback, useEffect, useRef } from 'react';
import { Chess, type Move } from 'chess.js';

export type EngineMove = { from: string; to: string; promotion?: string; san: string };

type PendingSearch = {
  fen: string;
  depth: number;
  resolve(move: EngineMove): void;
  timer: number;
};

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<PendingSearch | null>(null);

  useEffect(() => {
    const worker = new Worker('/engines/stockfish-18-lite-single.js#/engines/stockfish-18-lite-single.wasm,worker');
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<string | { loaded?: number; total?: number }>) => {
      if (typeof event.data !== 'string') return;
      if (!event.data.startsWith('bestmove ')) return;
      const pending = pendingRef.current;
      if (!pending) return;
      window.clearTimeout(pending.timer);
      pendingRef.current = null;
      pending.resolve(toEngineMove(pending.fen, event.data));
    };
    worker.onerror = () => {
      const pending = pendingRef.current;
      if (pending) {
        window.clearTimeout(pending.timer);
        pendingRef.current = null;
        pending.resolve(chooseFallbackMove(pending.fen, pending.depth));
      }
    };
    worker.postMessage('uci');
    worker.postMessage('isready');
    worker.postMessage('ucinewgame');
    return () => {
      worker.postMessage('quit');
      worker.terminate();
    };
  }, []);

  return useCallback((fen: string, depth = 2) =>
    new Promise<EngineMove>((resolve) => {
      const worker = workerRef.current;
      const timer = window.setTimeout(() => {
        pendingRef.current = null;
        resolve(chooseFallbackMove(fen, depth));
      }, 3000);
      pendingRef.current = { fen, depth, resolve, timer };
      if (!worker) {
        window.clearTimeout(timer);
        pendingRef.current = null;
        resolve(chooseFallbackMove(fen, depth));
        return;
      }
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage(`go depth ${depth}`);
    }), []);
}

function toEngineMove(fen: string, line: string): EngineMove {
  const uci = line.split(/\s+/)[1] ?? '';
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.slice(4, 5) || undefined;
  const chess = new Chess(fen);
  const move = chess.move({ from, to, promotion });
  if (!move) return chooseFallbackMove(fen, 1);
  return { from, to, promotion, san: move.san };
}

function chooseFallbackMove(fen: string, depth: number): EngineMove {
  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true });
  const best = moves
    .map((move) => ({ move, score: scoreMove(chess, move, depth) }))
    .sort((a, b) => b.score - a.score)[0]?.move ?? moves[0]!;
  return { from: best.from, to: best.to, promotion: best.promotion, san: best.san };
}

function scoreMove(chess: Chess, move: Move, depth: number) {
  const values: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  let score = move.captured ? values[move.captured] ?? 0 : 0;
  const clone = new Chess(chess.fen());
  clone.move({ from: move.from, to: move.to, promotion: move.promotion });
  if (clone.isCheckmate()) score += 100000;
  if (clone.isCheck()) score += 50;
  score += depth;
  return score;
}
