import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Course, Prisma, User } from '@prisma/client';

export interface CourseModelPort {
  getOneIncludeUsers({
    courseId,
    transaction,
  }: {
    courseId: number;
    transaction: Prisma.TransactionClient;
  }): Promise<Course & { user: User[] }>;
  getOne({
    courseId,
    transaction,
  }: {
    courseId: number;
    transaction?: Prisma.TransactionClient;
  }): Promise<Course>;
}

@Injectable()
export class CoursesRepository implements CourseModelPort {
  // constructor() {}

  async getOneIncludeUsers({
    courseId,
    transaction,
  }: {
    courseId: number;
    transaction: Prisma.TransactionClient;
  }): Promise<Course & { user: User[] }> {
    return await transaction.course.findUnique({
      where: {
        id: courseId,
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
  }): Promise<Course> {
    return await transaction.course.findUnique({
      where: {
        id: courseId,
      },
    });
  }
}
