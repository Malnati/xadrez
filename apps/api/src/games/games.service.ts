import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Chess } from 'chess.js';
import {
  applyMove,
  createGameSchema,
  createInitialSnapshot,
  moveInputSchema,
  resolveResult,
  type ClockPreset,
  type GameMode,
  type GameSnapshot,
  type MoveInput,
} from '@xadrez/shared';
import { PrismaService } from '../prisma/prisma.service';
import { toSnapshot } from './game.mapper';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async createGame(input: { mode: GameMode; clock: ClockPreset; whitePlayerId?: string | null }) {
    const parsed = createGameSchema.parse({ mode: input.mode, clock: input.clock });
    const snapshot = createInitialSnapshot(crypto.randomUUID(), parsed.mode, parsed.clock);
    const game = await this.prisma.game.create({
      data: {
        mode: parsed.mode,
        status: snapshot.status,
        result: snapshot.result,
        fen: snapshot.fen,
        pgn: snapshot.pgn,
        clock: parsed.clock,
        whiteTimeLeft: parsed.clock.initialSeconds,
        blackTimeLeft: parsed.clock.initialSeconds,
        whitePlayerId: input.whitePlayerId ?? undefined,
        clocks: {
          create: [
            { color: 'white', secondsLeft: parsed.clock.initialSeconds },
            { color: 'black', secondsLeft: parsed.clock.initialSeconds },
          ],
        },
      },
      include: { moves: true },
    });
    return toSnapshot(game);
  }

  async getGame(id: string) {
    const game = await this.prisma.game.findUnique({ where: { id }, include: { moves: true } });
    if (!game) {
      throw new NotFoundException('Partida não encontrada');
    }
    return toSnapshot(game);
  }

  async listHistory(userId?: string) {
    const games = await this.prisma.game.findMany({
      where: userId
        ? {
            OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
          }
        : undefined,
      include: { moves: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return games.map(toSnapshot);
  }

  async applyMove(input: MoveInput) {
    const parsed = moveInputSchema.parse(input);
    const current = await this.getGame(parsed.gameId);
    let next: GameSnapshot;
    try {
      next = applyMove(current, parsed);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Movimento inválido');
    }

    const last = next.moves.at(-1);
    if (!last) {
      throw new BadRequestException('Movimento inválido');
    }

    const game = await this.prisma.game.update({
      where: { id: parsed.gameId },
      data: {
        fen: next.fen,
        pgn: next.pgn,
        status: next.status,
        result: next.result,
        whiteTimeLeft: next.whiteTimeLeft,
        blackTimeLeft: next.blackTimeLeft,
        moves: {
          create: {
            moveNumber: next.moves.length,
            san: last.san,
            fromSquare: last.from,
            toSquare: last.to,
            color: last.color,
            piece: last.piece,
            captured: last.captured,
            promotion: last.promotion,
            fen: last.fen,
            whiteTimeLeft: last.whiteTimeLeft,
            blackTimeLeft: last.blackTimeLeft,
          },
        },
        clocks: {
          upsert: [
            {
              where: { gameId_color: { gameId: parsed.gameId, color: 'white' } },
              create: { color: 'white', secondsLeft: next.whiteTimeLeft },
              update: { secondsLeft: next.whiteTimeLeft },
            },
            {
              where: { gameId_color: { gameId: parsed.gameId, color: 'black' } },
              create: { color: 'black', secondsLeft: next.blackTimeLeft },
              update: { secondsLeft: next.blackTimeLeft },
            },
          ],
        },
      },
      include: { moves: true },
    });
    return toSnapshot(game);
  }

  async resign(gameId: string, color: 'white' | 'black') {
    const result = color === 'white' ? 'black' : 'white';
    const game = await this.prisma.game.update({
      where: { id: gameId },
      data: { status: 'completed', result: 'resigned', pgn: { set: `${(await this.getGame(gameId)).pgn}\n${result} venceu por abandono.` } },
      include: { moves: true },
    });
    return toSnapshot(game);
  }

  evaluateFen(fen: string) {
    const chess = new Chess(fen);
    return { result: resolveResult(chess), turn: chess.turn(), pgn: chess.pgn() };
  }
}
