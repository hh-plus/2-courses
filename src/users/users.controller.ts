import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '@/prisma/repositories/prisma.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaservice: PrismaService,
  ) {}

  @Get('/')
  async getResultOfApply(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('courseId', ParseIntPipe) courseId: number,
  ) {
    await this.prismaservice.$transaction(async (transaction) => {
      return await this.usersService.getOne({
        userId,
        courseId,
        transaction,
      });
    });
  }
}
