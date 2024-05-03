import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from '../auth/dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  getByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email
      }
    })
  }

  getById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id
      }
    })
  }

  create(user: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        ...user
      }
    })
  }
}
