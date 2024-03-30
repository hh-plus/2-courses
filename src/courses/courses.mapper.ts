import { Course, User } from '@prisma/client';

type CourseWithUser = (Course & { user: User[] })[];

export class CoursesMapper {
  static toCurses(courses: CourseWithUser) {
    return courses.map((course) => {
      return {
        id: course.id,
        title: course.title,
        maxUsers: course.maxUsers,
        startDate: course.startDate,
        createdAt: course.createdAt,
        userCount: course.user.length,
      };
    });
  }
}
