import { CourseModelPort } from '@/prisma/repositories/courses.repository';
import { Course, User } from '@prisma/client';

export abstract class CoursesRepositoryPort implements CourseModelPort {
  getOne: ({ courseId }: { courseId: number }) => Promise<Course>;

  getOneIncludeUsers: ({
    courseId,
  }: {
    courseId: number;
  }) => Promise<Course & { user: User[] }>;
}
