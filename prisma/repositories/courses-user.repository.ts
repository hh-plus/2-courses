import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

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
}

@Injectable()
export class CoursesUserRepository implements CoursesUserModelPort {
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
