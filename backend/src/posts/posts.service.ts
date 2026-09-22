import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        content: dto.content,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
  }

  async findAll(userId: number) {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        _count: { select: { likes: true } },
        likes: { where: { userId }, select: { userId: true } },
      },
    });

    return posts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      likedByMe: post.likes.length > 0,
      likes: undefined,
      _count: undefined,
    }));
  }

  async remove(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('投稿が見つかりません');
    if (post.authorId !== userId) throw new ForbiddenException('削除できません');
    await this.prisma.post.delete({ where: { id: postId } });
  }
}