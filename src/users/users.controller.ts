import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '@/prisma/prisma.service';

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
    let result = null;
    await this.prismaservice.$transaction(async (transaction) => {
      const message = await this.usersService.getOne({
        userId,
        courseId,
        transaction,
      });
      result = message;
    });
    return {
      message: result,
    };
  }
}
