import { Course, User } from '@prisma/client';

export abstract class CoursesRepositoryPort {
  getOne: ({ courseId }: { courseId: number }) => Promise<Course>;
  create: (course: Course) => Promise<Course>;
  getOneIncludeUsers: ({
    courseId,
  }: {
    courseId: number;
  }) => Promise<Course & { user: User[] }>;
}
