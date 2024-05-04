import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'

import { UserService } from 'src/user/user.service'

import { hash, verify } from 'argon2'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'

import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'

@Injectable()
export class AuthService {
  REFRESH_TOKEN_NAME = 'refreshToken'
  REFRESH_TOKEN_EXPIRES_DATE = 7

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(user: CreateUserDto) {
    const existingUser = await this.userService.getByEmail(user.email)

    if (existingUser) throw new BadRequestException('User already exist!')

    const hashedPassword = await hash(user.password)

    const createdUser = await this.userService.create({
      ...user,
      password: hashedPassword
    })

    const tokens = this.issueTokens(createdUser.id)

    return { user, ...tokens }
  }

  async login(user: LoginUserDto) {
    const existingUser = await this.userService.getByEmail(user.email)

    if (!existingUser)
      throw new UnauthorizedException('User does not exist yet!')

    const passwordMatch = await verify(existingUser.password, user.password)

    if (!passwordMatch) throw new BadRequestException('Password dont match!')

    const tokens = this.issueTokens(existingUser.id)

    return { user, ...tokens }
  }

  private issueTokens(id: string) {
    const data = { id }

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '2d',
      secret: process.env.JWT_SECRET
    })

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET
    })

    return { accessToken, refreshToken }
  }

  addRefreshTokenToCookies(res: Response, refreshToken: string) {
    const expiresIn = new Date()
    expiresIn.setDate(expiresIn.getDate() + this.REFRESH_TOKEN_EXPIRES_DATE)

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      expires: expiresIn,
      httpOnly: true,
      secure: true
    })
  }

  removeRefreshToken(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      secure: true,
      httpOnly: true,
      expires: new Date(0)
    })
  }

  getNewTokens(token: string) {
    const validatedRefreshToken = this.jwtService.verify(token)
    if (!validatedRefreshToken) throw new UnauthorizedException()

    const { accessToken, refreshToken } = this.issueTokens(
      validatedRefreshToken.id
    )

    return { accessToken, refreshToken }
  }
}
