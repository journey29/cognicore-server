import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin: ['https://cognicore-client.vercel.app'],
    exposedHeaders: 'set-cookies'
  })

  await app.listen(3001)
}
bootstrap()
