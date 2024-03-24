import { Injectable } from '@nestjs/common';
import { CoursesRepositoryPort } from './port/courses.repository.interface';
import { CoursesUserRepositoryPort } from './port/courses-user.repository.port';
import { Course, User } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepositoryPort,
    private readonly coursesUserRepository: CoursesUserRepositoryPort,
  ) {}

  async getOne({ courseId }: { courseId: number }) {}

  async apply({ courseId, userId }: { courseId: number; userId: number }) {
    await this.coursesUserRepository.create({
      courseId,
      userId,
    });
  }
}
