import { Injectable } from '@nestjs/common';
import { CoursesRepositoryPort } from './port/course.repository.interface';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepositoryPort) {}
}
