import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { clockPresets, type ClockPreset, type GameMode, type MoveInput } from '@xadrez/shared';
import { GamesService } from './games.service';

class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_err: unknown, user: TUser) {
    return user;
  }
}

@Controller('games')
export class GamesController {
  constructor(private readonly games: GamesService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  create(@Body() body: { mode?: GameMode; clock?: ClockPreset }, @Req() req: Request & { user?: any }) {
    return this.games.createGame({
      mode: body.mode ?? 'computer',
      clock: body.clock ?? clockPresets[0]!,
      whitePlayerId: req.user?.id ?? null,
    });
  }

  @Get('history')
  @UseGuards(OptionalJwtGuard)
  history(@Req() req: Request & { user?: any }) {
    return this.games.listHistory(req.user?.id);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.games.getGame(id);
  }

  @Get(':id/pgn')
  async pgn(@Param('id') id: string) {
    const game = await this.games.getGame(id);
    return { id, pgn: game.pgn };
  }

  @Post(':id/moves')
  move(@Param('id') id: string, @Body() body: Omit<MoveInput, 'gameId'>) {
    return this.games.applyMove({ ...body, gameId: id });
  }
}
