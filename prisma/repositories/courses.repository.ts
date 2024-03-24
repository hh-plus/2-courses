import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  getOne(id: number) {
    return this.prisma.course.findUnique({
      where: {
        id,
      },
    });
  }
}
