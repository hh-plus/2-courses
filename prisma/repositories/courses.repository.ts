import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Course, Prisma, User } from '@prisma/client';

export interface CourseModelPort {
  getAll({}): Promise<(Course & { user: User[] })[]>;

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
  constructor(private readonly prismaService: PrismaService) {}

  async getAll({}): Promise<(Course & { user: User[] })[]> {
    const currentDate = new Date();
    return await this.prismaService.course.findMany({
      include: {
        user: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      where: {
        startDate: {
          gte: currentDate,
        },
      },
    });
  }

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
