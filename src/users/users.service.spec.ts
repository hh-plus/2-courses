import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CoursesUserRepositoryPort } from '../courses/port/courses-user.repository.port';
import { Prisma } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let coursesUserRepositoryPort: CoursesUserRepositoryPort = {
    getOne: jest.fn(),
    create: jest.fn(),
  };

  let transaction: Prisma.TransactionClient;

  beforeEach(async () => {
    service = new UsersService(coursesUserRepositoryPort);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOne', () => {
    it('존재해야 한다.', () => {
      expect(service.getOne).toBeDefined();
    });

    it('userId가 없으면 에러를 던져야한다.', async () => {
      const userId = undefined;
      const courseId = 1;

      await expect(
        service.getOne({ userId, courseId, transaction }),
      ).rejects.toThrow();
    });

    it('courseId가 없으면 에러를 던져야한다.', async () => {
      const userId = 1;
      const courseId = undefined;

      await expect(
        service.getOne({ userId, courseId, transaction }),
      ).rejects.toThrow();
    });

    it('coursesUserRepositoryPort.getOne을 호출해야한다.', async () => {
      const userId = 1;
      const courseId = 1;

      await service.getOne({ userId, courseId, transaction });

      expect(coursesUserRepositoryPort.getOne).toHaveBeenCalled();
    });
  });
});
