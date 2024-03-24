import { Injectable } from '@nestjs/common';
import { CoursesRepositoryPort } from './port/courses.repository.interface';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepositoryPort) {}

  async getOne({ courseId }: { courseId: number }) {}

  async apply({ course, user }) {}
}
