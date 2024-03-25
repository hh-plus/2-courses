import { Injectable } from '@nestjs/common';
import { CoursesRepositoryPort } from './port/courses.repository.interface';
import { CoursesUserRepositoryPort } from './port/courses-user.repository.port';
import { Course, Prisma, User } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepositoryPort,
    private readonly coursesUserRepository: CoursesUserRepositoryPort,
  ) {}

  async getOneIncludeUsers({
    courseId,
    transaction,
  }: {
    courseId: number;
    transaction: Prisma.TransactionClient;
  }) {
    if (!courseId) {
      throw new Error('courseId는 필수입니다.');
    }

    const course = await this.coursesRepository.getOneIncludeUsers({
      courseId,
      transaction,
    });

    if (!course) {
      throw new Error('해당 강의가 존재하지 않습니다.');
    }

    return course;
  }

  async checkFull({
    course,
  }: {
    course: Pick<Course, 'maxUsers'> & { user: Pick<User, 'id'>[] };
  }) {
    if (course.user.length >= course.maxUsers) {
      throw new Error('정원이 초과되었습니다.');
    }
  }

  async apply({
    courseId,
    userId,
    transaction,
  }: {
    courseId: number;
    userId: number;
    transaction: Prisma.TransactionClient;
  }) {
    if (!courseId || !userId) {
      throw new Error('courseId, userId는 필수입니다.');
    }

    await this.coursesUserRepository.create({
      courseId,
      userId,
      transaction,
    });
  }
}
