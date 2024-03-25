import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CoursesUserRepositoryPort } from '../courses/port/courses-user.repository.port';
import { CoursesUserRepository } from '@/prisma/repositories/courses-user.repository';
import { PrismaService } from '@/prisma/repositories/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    { provide: CoursesUserRepositoryPort, useClass: CoursesUserRepository },
  ],
})
export class UsersModule {}
