import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';

import { PrismaService } from '@/prisma/repositories/prisma.service';
import { Prisma } from '@prisma/client';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly coursesService: CoursesService,
  ) {}

  // 로그인을 구현하지 않았으니 userId를 쿼리로 받는다고 가정.
  @Post('/apply/:courseId')
  async apply(
    @Query('userId', ParseIntPipe) userId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    const MAX_RETRIES = 10;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        await this.prismaService.$transaction(
          async (transaction) => {
            const course = await this.coursesService.getOneIncludeUsers({
              courseId,
              transaction,
            });
            this.coursesService.checkFull({ course });
            this.coursesService.checkDuplicate({
              userId,
              courseId: course.id,
              transaction,
            });
            this.coursesService.checkPassedStartTime({ course });
            await this.coursesService.apply({
              userId,
              courseId: course.id,
              transaction,
            });
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            maxWait: 5000, // default: 2000
            timeout: 10000, // default: 5000
          },
        );
        break;
      } catch (e: any) {
        if (e.code === 'P2034') {
          retries++;
          continue;
        }

        throw e;
      }
    }
  }
}
