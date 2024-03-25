import { CoursesUserModelPort } from '@/prisma/repositories/courses-user.repository';
import { CourseUser, Prisma } from '@prisma/client';
export abstract class CoursesUserRepositoryPort
  implements CoursesUserModelPort
{
  getOne: ({
    courseId,
    userId,
    transaction,
  }: {
    courseId: number;
    userId: number;
    transaction: Prisma.TransactionClient;
  }) => Promise<CourseUser>;

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
