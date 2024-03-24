import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOneIncludeUsers(id: number) {
    return await this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async getOne(id: number) {
    return await this.prisma.course.findUnique({
      where: {
        id,
      },
    });
  }
}
