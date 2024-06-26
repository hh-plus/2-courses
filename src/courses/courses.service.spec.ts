import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { CoursesRepositoryPort } from './port/courses.repository.port';
import { CoursesUserRepositoryPort } from './port/courses-user.repository.port';
import { CourseUser, Prisma, User } from '@prisma/client';

describe('CoursesService', () => {
  let service: CoursesService;
  let transaction: Prisma.TransactionClient;
  const coursesRepositoryPort: CoursesRepositoryPort = {
    getAll: jest.fn((transaction) =>
      Promise.resolve([
        {
          id: 1,
          title: '특강',
          maxUsers: 2,
          startDate: new Date('2025-01-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
          user: [],
        },
        {
          id: 1,
          title: '특강2',
          maxUsers: 5,
          startDate: new Date('2025-01-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
          user: [],
        },
      ]),
    ),
    getOne: jest.fn(),
    // create: jest.fn(),
    getOneIncludeUsers: jest.fn(),
  };
  const coursesUserRepository: CoursesUserRepositoryPort = {
    create: jest.fn(),
    getOne: jest.fn(),
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

  describe('getAll', () => {
    it('존재해야 한다.', () => {
      expect(service.getAll).toBeDefined();
    });

    it('coursesRepositoryPort.getAll을 호출해야한다.', async () => {
      await service.getAll({});

      expect(coursesRepositoryPort.getAll).toHaveBeenCalled();
    });
  });

  describe('getOneIncludeUsers', () => {
    it('존재해야 한다.', () => {
      expect(service.getOneIncludeUsers).toBeDefined();
    });

    it('courseId가 없으면 에러를 던져야한다.', async () => {
      const courseId = undefined;

      await expect(
        service.getOneIncludeUsers({ courseId, transaction }),
      ).rejects.toThrow();
    });

    it('coursesRepositoryPort.getOne을 호출해야한다.', async () => {
      const courseId = 1;

      coursesRepositoryPort.getOneIncludeUsers = jest
        .fn()
        .mockResolvedValue({ id: 1 });
      await service.getOneIncludeUsers({ courseId, transaction });

      expect(coursesRepositoryPort.getOneIncludeUsers).toHaveBeenCalled();
    });
  });

  describe('checkDuplicate', () => {
    it('존재해야 한다.', () => {
      expect(service.checkDuplicate).toBeDefined();
    });

    it('courseId가 없으면 에러를 던져야한다.', async () => {
      const courseId = undefined;
      const userId = 1;

      await expect(
        service.checkDuplicate({ courseId, userId, transaction }),
      ).rejects.toThrow();
    });

    it('userId가 없으면 에러를 던져야한다.', async () => {
      const courseId = 1;
      const userId = undefined;

      await expect(
        service.checkDuplicate({ courseId, userId, transaction }),
      ).rejects.toThrow();
    });

    it('이미 신청한 강의일 때 에러를 던져야한다.', async () => {
      const courseId = 1;
      const userId = 1;

      coursesUserRepository.getOne = jest.fn().mockResolvedValue(courseUser);
      await expect(
        service.checkDuplicate({ courseId, userId, transaction }),
      ).rejects.toThrow();
    });
  });

  describe('checkPassedStartTime', () => {
    it('존재해야 한다.', () => {
      expect(service.checkPassedStartTime).toBeDefined();
    });

    it('시작 시간이 지났을 때 에러를 던져야한다.', async () => {
      const course = {
        startDate: new Date('2021-01-01'),
      };

      expect(() => service.checkPassedStartTime({ course })).toThrow();
    });
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

      expect(() => service.checkFull({ course })).toThrow();
    });

    it('정원이 초과되지 않았을 때 에러를 던지지 않아야한다.', async () => {
      const course = {
        user: [courseUser],
        maxUsers: 2,
      };

      expect(() => service.checkFull({ course })).not.toThrow();
    });
  });

  describe('apply', () => {
    it('존재해야 한다.', () => {
      expect(service.apply).toBeDefined();
    });

    it('신청 기록 생성을 호출해야한다.', async () => {
      const courseId = 1;
      const userId = 1;

      await service.apply({ courseId, userId, transaction });

      expect(coursesUserRepository.create).toHaveBeenCalled();
    });

    it('courseId가 없으면 에러를 던져야한다.', async () => {
      const courseId = undefined;
      const userId = 1;

      await expect(
        service.apply({ courseId, userId, transaction }),
      ).rejects.toThrow();
    });

    it('userId가 없으면 에러를 던져야한다.', async () => {
      const courseId = 1;
      const userId = undefined;

      await expect(
        service.apply({ courseId, userId, transaction }),
      ).rejects.toThrow();
    });
  });
});
