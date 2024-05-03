import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard'
import { CurrentUser } from 'src/auth/decorators/user.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  getByEmail(@Query('email') email?: string) {
    return email
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById(id)
  }
}
