import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class CoursesUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create({ courseId, userId }: { courseId: number; userId: number }) {
    return await this.prisma.courseUser.create({
      data: {
        courseId,
        userId,
      },
    });
  }
}
