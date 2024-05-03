import { Injectable } from '@nestjs/common'
import { OpenAI } from 'openai'
import { ImagesDto, MessagesDto } from './dto/conversation.dto'
@Injectable()
export class AiService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  private codeDefault =
    'You are a code generator. You must answer only in code markdown snippets. Use code comments for explanations.'

  async conversation(data: MessagesDto[]) {
    const completion = await this.openai.chat.completions.create({
      messages: data,
      model: 'gpt-3.5-turbo'
    })

    return completion.choices[0].message
  }

  async code(data: MessagesDto[]) {
    const completion = await this.openai.chat.completions.create({
      messages: [{ content: this.codeDefault, role: 'system' }, ...data],
      model: 'gpt-3.5-turbo'
    })

    return completion.choices[0].message
  }

  async images(data: ImagesDto) {
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: data.prompt,
      n: 1,
      size: '1024x1024'
    })

    return { url: response.data[0].url, role: 'assistant' }
  }
}
