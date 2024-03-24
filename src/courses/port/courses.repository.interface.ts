import { Course } from '@prisma/client';

export abstract class CoursesRepositoryPort {
  getOne: (id: number) => Promise<Course>;
  create: (course: Course) => Promise<Course>;
}
