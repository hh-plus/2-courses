import { CoursesUserModelPort } from '@/prisma/repositories/courses-user.repository';
export abstract class CoursesUserRepositoryPort
  implements CoursesUserModelPort
{
  create: ({
    courseId,
    userId,
  }: {
    courseId: number;
    userId: number;
  }) => Promise<void>;
}
