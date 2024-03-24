import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesRepositoryPort } from './port/course.repository.interface';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('/')
  async getOne() {}
}
