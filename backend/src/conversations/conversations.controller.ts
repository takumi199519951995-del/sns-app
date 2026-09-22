import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload';
import { ConversationsService } from './conversations.service';

class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.conversationsService.findAll(user.sub);
  }

  @Post(':username')
  findOrCreate(
    @CurrentUser() user: JwtPayload,
    @Param('username') username: string,
  ) {
    return this.conversationsService.findOrCreate(user.sub, username);
  }

  @Get(':id/messages')
  findMessages(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.conversationsService.findMessages(id, user.sub);
  }

  @Post(':id/messages')
  sendMessage(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.conversationsService.sendMessage(id, user.sub, dto.content);
  }
}