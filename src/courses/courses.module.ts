import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesRepository } from '@/prisma/repositories/courses.repository';
import { CoursesRepositoryPort } from './port/courses.repository.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { CoursesUserRepositoryPort } from './port/courses-user.repository.port';
import { CoursesUserRepository } from '@/prisma/repositories/courses-user.repository';

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [
    PrismaService,

    CoursesService,
    { provide: CoursesRepositoryPort, useClass: CoursesRepository },
    { provide: CoursesUserRepositoryPort, useClass: CoursesUserRepository },
  ],
})
export class CoursesModule {}
