import { CourseModelPort } from '@/prisma/repositories/courses.repository';
import { Course, Prisma, User } from '@prisma/client';

export abstract class CoursesRepositoryPort implements CourseModelPort {
  getAll: ({}: {}) => Promise<(Course & { user: User[] })[]>;

  getOne: ({
    courseId,
    transaction,
  }: {
    courseId: number;
    transaction: Prisma.TransactionClient;
  }) => Promise<Course>;

  getOneIncludeUsers: ({
    courseId,
    transaction,
  }: {
    courseId: number;
    transaction: Prisma.TransactionClient;
  }) => Promise<Course & { user: User[] }>;
}
