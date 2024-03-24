import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesRepository } from '@/prisma/repositories/courses.repository';
import { CoursesRepositoryPort } from './port/courses.repository.interface';
import { PrismaService } from '@/prisma/repositories/prisma.service';
import { CoursesUserRepositoryPort } from './port/courses-user.repository.port';

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [
    PrismaService,
    CoursesService,
    { provide: CoursesRepositoryPort, useClass: CoursesRepository },
    { provide: CoursesUserRepositoryPort, useClass: CoursesRepository },
  ],
})
export class CoursesModule {}
