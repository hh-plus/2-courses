import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOneIncludeUsers(id: number) {
    return await this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async getOne({
    courseId,
    transaction,
  }: {
    courseId: number;
    transaction?: Prisma.TransactionClient;
  }) {
    return await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
  }
}
