import { Injectable } from '@nestjs/common';
import { CoursesRepositoryPort } from './port/courses.repository.interface';
import { CoursesUserRepositoryPort } from './port/courses-user.repository.port';
import { Course, Prisma, User } from '@prisma/client';

type CourseWithUser = Pick<Course, 'maxUsers'> & { user: Pick<User, 'id'>[] };

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepositoryPort,
    private readonly coursesUserRepository: CoursesUserRepositoryPort,
  ) {}

  async getOne({ courseId }: { courseId: number }) {}

  async checkFull({ course }: { course: CourseWithUser }) {
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
