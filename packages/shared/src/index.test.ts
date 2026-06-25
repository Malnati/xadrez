import { describe, expect, it } from 'vitest';
import { applyMove, clockPresets, createInitialSnapshot, formatClock } from './index';

describe('shared chess utilities', () => {
  it('formats clocks as mm:ss', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(185)).toBe('03:05');
  });

  it('applies a legal chess move and records PGN state', () => {
    const snapshot = createInitialSnapshot('game-1', 'computer', clockPresets[0]!);
    const next = applyMove(snapshot, {
      gameId: 'game-1',
      from: 'e2',
      to: 'e4',
      whiteTimeLeft: 178,
      blackTimeLeft: 180,
    });

    expect(next.fen).toContain(' b ');
    expect(next.moves).toHaveLength(1);
    expect(next.moves[0]?.san).toBe('e4');
    expect(next.pgn).toContain('e4');
  });
});
