import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

describe('CoursesController', () => {
  let controller: CoursesController;
  let courseService: CoursesService;

  beforeEach(async () => {
    controller = new CoursesController(courseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
