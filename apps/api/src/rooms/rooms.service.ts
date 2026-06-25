import { Injectable, NotFoundException } from "@nestjs/common";
import { clockPresets, type ClockPreset, type MoveInput } from "@xadrez/shared";
import { PrismaService } from "../prisma/prisma.service";
import { GamesService } from "../games/games.service";
import { toSnapshot } from "../games/game.mapper";

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly games: GamesService,
  ) {}

  async createRoom(hostId?: string, clock: ClockPreset = clockPresets[0]!) {
    const game = await this.games.createGame({
      mode: "room",
      clock,
      whitePlayerId: hostId ?? null,
    });
    const room = await this.prisma.room.create({
      data: {
        code: createRoomCode(),
        gameId: game.id,
        hostId,
      },
      include: { game: { include: { moves: true } } },
    });
    return {
      code: room.code,
      gameId: room.gameId,
      hostId: room.hostId ?? "guest",
      status: room.status,
      snapshot: toSnapshot(room.game),
    };
  }

  async joinRoom(code: string, guestId?: string) {
    const room = await this.prisma.room
      .update({
        where: { code },
        data: {
          status: "playing",
          guestId,
          game: { update: { status: "active", blackPlayerId: guestId } },
        },
        include: { game: { include: { moves: true } } },
      })
      .catch(() => null);
    if (!room) {
      throw new NotFoundException("Sala não encontrada");
    }
    return {
      code: room.code,
      gameId: room.gameId,
      hostId: room.hostId ?? "guest",
      guestId: room.guestId ?? "guest",
      status: room.status,
      snapshot: toSnapshot(room.game),
    };
  }

  async move(code: string, input: Omit<MoveInput, "gameId">) {
    const room = await this.prisma.room.findUnique({ where: { code } });
    if (!room) {
      throw new NotFoundException("Sala não encontrada");
    }
    return this.games.applyMove({ ...input, gameId: room.gameId });
  }
}

function createRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
