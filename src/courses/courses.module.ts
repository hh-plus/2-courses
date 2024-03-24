import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesRepository } from '@/prisma/repositories/courses.repository';
import { CoursesRepositoryPort } from './port/course.repository.interface';
import { PrismaService } from '@/prisma/repositories/prisma.service';

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [
    PrismaService,
    CoursesService,
    { provide: CoursesRepositoryPort, useClass: CoursesRepository },
  ],
})
export class CoursesModule {}
