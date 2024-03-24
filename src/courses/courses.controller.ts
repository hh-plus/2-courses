import { Controller, Get, Post, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';

import { PrismaService } from '@/prisma/repositories/prisma.service';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get('/')
  async getOne() {}

  // 로그인을 구현하지 않았으니 userId를 쿼리로 받는다고 가정.
  @Post('/apply')
  async apply(@Query('userId') userId: number) {
    await this.prismaService.$transaction(async (transaction) => {
      const course = await this.coursesService.getOneIncludeUsers({
        courseId: 1,
      });
      await this.coursesService.checkFull({ course });
      await this.coursesService.apply({ userId, courseId: course.id });
    });
  }
}
