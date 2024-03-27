import { PrismaService } from '@/prisma/prisma.service';
import { AppModule } from '@/src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import * as request from 'supertest';

describe('User', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // 테스트 전에 데이터를 모두 삭제한다.
    await prismaService.courseUser.deleteMany();
    await prismaService.course.deleteMany();
    await prismaService.user.deleteMany();
  });

  describe('참가 성공과 실패의 string을 반환한다.', () => {
    let user1 = null;
    let user2 = null;
    let user3 = null;
    let newCourse = null;
    beforeEach(async () => {
      newCourse = await prismaService.course.create({
        data: {
          title: '특강',
          maxUsers: 2,
        },
      });

      user1 = await prismaService.user.create({
        data: {
          id: 1000,
        },
      });

      user2 = await prismaService.user.create({
        data: {
          id: 2000,
        },
      });

      user3 = await prismaService.user.create({
        data: {
          id: 3000,
        },
      });

      await request(app.getHttpServer())
        .post(`/courses/apply/${newCourse.id}`)
        .query({ userId: user1.id });

      await request(app.getHttpServer())
        .post(`/courses/apply/${newCourse.id}`)
        .query({ userId: user2.id });
    });
    it('신청에 실패했으면 실패 메시지를 반환한다.', async () => {
      const result = await request(app.getHttpServer())
        .get(`/users`)
        .query({ userId: user3.id, courseId: newCourse.id });
      console.log(result);
      expect(result).toBe('신청 실패..');
    });
  });
});
