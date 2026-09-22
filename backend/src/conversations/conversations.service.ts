import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(userOneId: number, userTwoUsername: string) {
    const userTwo = await this.prisma.user.findUnique({
      where: { username: userTwoUsername },
    });
    if (!userTwo) {
      throw new NotFoundException('ユーザーが見つかりません');
    }

    const [smallerId, largerId] =
      userOneId < userTwo.id
        ? [userOneId, userTwo.id]
        : [userTwo.id, userOneId];

    return this.prisma.conversation.upsert({
      where: { userOneId_userTwoId: { userOneId: smallerId, userTwoId: largerId } },
      create: { userOneId: smallerId, userTwoId: largerId },
      update: {},
      include: {
        userOne: { select: { id: true, username: true, displayName: true } },
        userTwo: { select: { id: true, username: true, displayName: true } },
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
      include: {
        userOne: { select: { id: true, username: true, displayName: true } },
        userTwo: { select: { id: true, username: true, displayName: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMessages(conversationId: number, userId: number) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
    });
    if (!conversation) {
      throw new NotFoundException('会話が見つかりません');
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, username: true, displayName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(conversationId: number, senderId: number, content: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ userOneId: senderId }, { userTwoId: senderId }],
      },
    });
    if (!conversation) {
      throw new NotFoundException('会話が見つかりません');
    }

    return this.prisma.message.create({
      data: { content, conversationId, senderId },
      include: {
        sender: { select: { id: true, username: true, displayName: true } },
      },
    });
  }
}