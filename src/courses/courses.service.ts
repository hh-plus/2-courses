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

  async getOneIncludeUsers({ courseId }: { courseId: number }) {
    if (!courseId) {
      throw new Error('courseId는 필수입니다.');
    }

    return await this.coursesRepository.getOneIncludeUsers({ courseId });
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

  async apply({ courseId, userId }: { courseId: number; userId: number }) {
    if (!courseId || !userId) {
      throw new Error('courseId, userId는 필수입니다.');
    }

    await this.coursesUserRepository.create({
      courseId,
      userId,
    });
  }
}
