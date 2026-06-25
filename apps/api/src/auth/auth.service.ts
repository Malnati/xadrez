import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService, type OAuthUser } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async validateOAuthUser(profile: OAuthUser) {
    return this.users.upsertOAuthUser(profile);
  }

  issueToken(user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  }) {
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email });
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
