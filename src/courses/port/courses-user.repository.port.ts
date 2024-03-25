import { CoursesUserModelPort } from '@/prisma/repositories/courses-user.repository';
import { Prisma } from '@prisma/client';
export abstract class CoursesUserRepositoryPort
  implements CoursesUserModelPort
{
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
