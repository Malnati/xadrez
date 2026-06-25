import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";
import { readEnv } from "../config/env";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get("auth/google/start")
  @UseGuards(AuthGuard("google"))
  startGoogle() {
    return undefined;
  }

  @Get("auth/google/callback")
  @UseGuards(AuthGuard("google"))
  callback(@Req() req: Request & { user?: any }, @Res() res: Response) {
    const issued = this.auth.issueToken(req.user);
    const params = new URLSearchParams({ token: issued.accessToken });
    res.redirect(`${readEnv().webOrigin}/auth/callback?${params.toString()}`);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  me(@Req() req: Request & { user?: any }) {
    return { user: req.user };
  }
}
