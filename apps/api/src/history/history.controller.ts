import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { GamesService } from '../games/games.service';

class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_err: unknown, user: TUser) {
    return user;
  }
}

@Controller('history')
export class HistoryController {
  constructor(private readonly games: GamesService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  list(@Req() req: Request & { user?: any }) {
    return this.games.listHistory(req.user?.id);
  }
}
