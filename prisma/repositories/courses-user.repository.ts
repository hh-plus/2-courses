import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CourseUser, Prisma } from '@prisma/client';

export interface CoursesUserModelPort {
  create: ({
    courseId,
    userId,
    transaction,
  }: {
    courseId: number;
    userId: number;
    transaction: Prisma.TransactionClient;
  }) => Promise<void>;

  getOne: ({
    courseId,
    userId,
    transaction,
  }: {
    courseId: number;
    userId: number;
    transaction: Prisma.TransactionClient;
  }) => Promise<CourseUser>;
}

@Injectable()
export class CoursesUserRepository implements CoursesUserModelPort {
  async getOne({
    courseId,
    userId,
    transaction,
  }: {
    courseId: number;
    userId: number;
    transaction: Prisma.TransactionClient;
  }): Promise<CourseUser> {
    return await transaction.courseUser.findFirst({
      where: {
        courseId,
        userId,
      },
    });
  }

  async create({
    courseId,
    userId,
    transaction,
  }: {
    courseId: number;
    userId: number;
    transaction: Prisma.TransactionClient;
  }) {
    await transaction.courseUser.create({
      data: {
        courseId,
        userId,
      },
    });
  }
}
