import { IsArray, IsEnum, IsString } from 'class-validator'

enum Role {
  User,
  System,
  Assistant
}

export class MessagesDto {
  @IsArray()
  @IsString({
    each: true
  })
  content: string

  @IsEnum(Role, {
    message: 'Invalid type of chat user'
  })
  role: 'system' | 'user' | 'assistant'
}

export class ImagesDto {
  @IsString()
  prompt: string
}
