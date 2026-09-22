import { Controller, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload';
import { FollowsService } from './follows.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':username/follow')
  @HttpCode(204)
  follow(
    @CurrentUser() user: JwtPayload,
    @Param('username') username: string,
  ) {
    return this.followsService.follow(user.sub, username);
  }

  @Delete(':username/follow')
  @HttpCode(204)
  unfollow(
    @CurrentUser() user: JwtPayload,
    @Param('username') username: string,
  ) {
    return this.followsService.unfollow(user.sub, username);
  }
}