import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [PrismaModule, AuthModule, MailModule, PostsModule, LikesModule, FollowsModule],
  controllers: [AppController],
})
export class AppModule {}