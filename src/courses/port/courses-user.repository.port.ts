import { CoursesUserRepository } from '@/prisma/repositories/courses-user.repository';
export abstract class CoursesUserRepositoryPort {
  create: ({
    courseId,
    userId,
  }: {
    courseId: number;
    userId: number;
  }) => Promise<void>;
}
