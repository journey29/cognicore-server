import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { AiModule } from './ai/ai.module'

@Module({
  imports: [AuthModule, UserModule, AiModule]
})
export class AppModule {}
