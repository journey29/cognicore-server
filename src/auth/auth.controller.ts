import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'

import { AuthService } from './auth.service'

import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'

import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  @HttpCode(200)
  async register(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } =
      await this.authService.register(userDto)

    this.authService.addRefreshTokenToCookies(res, refreshToken)

    return response
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() userDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.authService.login(userDto)

    this.authService.addRefreshTokenToCookies(res, refreshToken)

    return response
  }

  @Post('logout')
  @HttpCode(200)
  signOut(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshToken(res)

    return true
  }

  @HttpCode(200)
  @Post('access-token')
  getNewTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookies =
      req.cookies[this.authService.REFRESH_TOKEN_NAME]

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshToken(refreshTokenFromCookies)
      throw new UnauthorizedException('Invalid refresh token')
    }

    const { accessToken, refreshToken } = this.authService.getNewTokens(
      refreshTokenFromCookies
    )

    this.authService.addRefreshTokenToCookies(res, refreshToken)

    return accessToken
  }
}
