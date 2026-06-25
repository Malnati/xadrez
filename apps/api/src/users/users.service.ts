import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type OAuthUser = {
  googleSubject: string;
  email: string;
  name?: string;
  avatarUrl?: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  upsertOAuthUser(profile: OAuthUser) {
    return this.prisma.user.upsert({
      where: { googleSubject: profile.googleSubject },
      update: {
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
      },
      create: profile,
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
