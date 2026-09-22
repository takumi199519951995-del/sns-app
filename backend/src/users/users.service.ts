import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string, currentUserId: number) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
        followers: {
          where: { followerId: currentUserId },
          select: { followerId: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('ユーザーが見つかりません');
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      isFollowing: user.followers.length > 0,
    };
  }
}