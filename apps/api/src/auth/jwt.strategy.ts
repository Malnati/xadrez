import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readEnv } from '../config/env';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readEnv().jwtSecret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.users.findById(payload.sub);
    return user ?? { id: payload.sub, email: payload.email };
  }
}
