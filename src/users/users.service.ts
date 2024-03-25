import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { CoursesUserRepositoryPort } from '../courses/port/courses-user.repository.port';

@Injectable()
export class UsersService {
  constructor(
    private readonly coursesUserRepository: CoursesUserRepositoryPort,
  ) {}

  async getOne({
    userId,
    courseId,
    transaction,
  }: {
    userId: number;
    courseId: number;
    transaction: Prisma.TransactionClient;
  }) {
    if (!userId || !courseId) {
      throw new Error('userId, courseId는 필수입니다.');
    }

    const courseUser = await this.coursesUserRepository.getOne({
      userId,
      courseId,
      transaction,
    });

    return courseUser ? '신청 성공!' : '신청 실패..';
  }
}
