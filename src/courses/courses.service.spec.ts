import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { CoursesRepositoryPort } from './port/courses.repository.interface';

describe('CoursesService', () => {
  let service: CoursesService;
  let coursesRepositoryPort: CoursesRepositoryPort;
  beforeEach(async () => {
    service = new CoursesService(coursesRepositoryPort);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('apply', () => {
    it('존재해야 한다.', () => {
      expect(service.apply).toBeDefined();
    });
  });
});
