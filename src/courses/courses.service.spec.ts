import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { CoursesRepositoryPort } from './port/courses.repository.interface';
import { CoursesUserRepositoryPort } from './port/courses-user.repository.port';
import { CourseUser, User } from '@prisma/client';

describe('CoursesService', () => {
  let service: CoursesService;
  let coursesRepositoryPort: CoursesRepositoryPort;
  let coursesUserRepository: CoursesUserRepositoryPort = {
    create: jest.fn(),
  };

  const courseUser: CourseUser = {
    id: 1,
    courseId: 1,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const courseUser2: CourseUser = {
    id: 2,
    courseId: 2,
    userId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    service = new CoursesService(coursesRepositoryPort, coursesUserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkFull', () => {
    it('존재해야 한다.', () => {
      expect(service.checkFull).toBeDefined();
    });

    it('정원이 초과되었을 때 에러를 던져야한다.', async () => {
      const course = {
        user: [courseUser, courseUser2],
        maxUsers: 2,
      };

      await expect(service.checkFull({ course })).rejects.toThrow();
    });

    it('정원이 초과되지 않았을 때 에러를 던지지 않아야한다.', async () => {
      const course = {
        user: [courseUser],
        maxUsers: 2,
      };

      await expect(service.checkFull({ course })).resolves.not.toThrow();
    });
  });

  describe('apply', () => {
    it('존재해야 한다.', () => {
      expect(service.apply).toBeDefined();
    });

    it('신청 기록 생성을 호출해야한다.', async () => {
      const courseId = 1;
      const userId = 1;

      await service.apply({ courseId, userId });

      expect(coursesUserRepository.create).toHaveBeenCalled();
    });

    it('courseId가 없으면 에러를 던져야한다.', async () => {
      const courseId = undefined;
      const userId = 1;

      await expect(service.apply({ courseId, userId })).rejects.toThrow();
    });

    it('userId가 없으면 에러를 던져야한다.', async () => {
      const courseId = 1;
      const userId = undefined;

      await expect(service.apply({ courseId, userId })).rejects.toThrow();
    });
  });
});
