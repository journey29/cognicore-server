import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { AiService } from './ai.service'
import { ImagesDto, MessagesDto } from './dto/conversation.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard'

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('conversation')
  conversation(@Body() conversationDto: MessagesDto[]) {
    return this.aiService.conversation(conversationDto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('code')
  code(@Body() codeDto: MessagesDto[]) {
    return this.aiService.code(codeDto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('images')
  images(@Body() imagesDto: ImagesDto) {
    return this.aiService.images(imagesDto)
  }
}
