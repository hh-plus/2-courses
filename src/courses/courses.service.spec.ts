import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { CoursesRepositoryPort } from './port/courses.repository.interface';
import { CoursesUserRepositoryPort } from './port/courses-user.repository.port';

describe('CoursesService', () => {
  let service: CoursesService;
  let coursesRepositoryPort: CoursesRepositoryPort;
  let coursesUserRepository: CoursesUserRepositoryPort = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    service = new CoursesService(coursesRepositoryPort, coursesUserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
