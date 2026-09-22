import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: number, followeeUsername: string) {
    const followee = await this.prisma.user.findUnique({
      where: { username: followeeUsername },
    });
    if (!followee) {
      throw new NotFoundException('ユーザーが見つかりません');
    }
    await this.prisma.follow.upsert({
      where: { followerId_followeeId: { followerId, followeeId: followee.id } },
      create: { followerId, followeeId: followee.id },
      update: {},
    });
  }

  async unfollow(followerId: number, followeeUsername: string) {
    const followee = await this.prisma.user.findUnique({
      where: { username: followeeUsername },
    });
    if (!followee) {
      throw new NotFoundException('ユーザーが見つかりません');
    }
    await this.prisma.follow.deleteMany({
      where: { followerId, followeeId: followee.id },
    });
  }
}