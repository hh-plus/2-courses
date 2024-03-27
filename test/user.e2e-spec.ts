import { AppModule } from '@/src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';

import * as request from 'supertest';
import { setDate } from './utils/setDate';
import { setupPrismaService } from './utils/setTestContainer';
import { PrismaService } from '@/prisma/prisma.service';

describe('User', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let container;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(await setupPrismaService())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    moduleFixture.useLogger(false);

    prisma = await setupPrismaService();
  });

  describe('참가 성공과 실패의 string을 반환한다.', () => {
    let newCourse = null;
    let user1 = null;
    let user2 = null;
    let user3 = null;

    beforeEach(async () => {
      newCourse = await prisma.course.create({
        data: {
          title: '특강',
          maxUsers: 2,
          startDate: setDate(1),
        },
      });

      user1 = await prisma.user.create({
        data: {},
      });

      user2 = await prisma.user.create({
        data: {},
      });

      user3 = await prisma.user.create({
        data: {},
      });

      const apply1 = await request(app.getHttpServer())
        .post(`/courses/apply/${newCourse.id}`)
        .query({ userId: user1.id });

      const apply2 = await request(app.getHttpServer())
        .post(`/courses/apply/${newCourse.id}`)
        .query({ userId: user2.id });

      if (apply1.error || apply2.error) {
        // console.log(apply1.error);
        // console.log(apply2.error);
        throw new Error('신청에 실패했습니다.');
      }
    });

    it('신청에 성공했으면 성공 메시지를 반환한다.', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/users`)
        .query({ userId: user1.id, courseId: newCourse.id });

      expect(body.message).toBe('신청 성공!');
    });

    it('신청에 실패했으면 실패 메시지를 반환한다.', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/users`)
        .query({ userId: user3.id, courseId: newCourse.id });

      expect(body.message).toBe('신청 실패..');
    });
  });

  afterAll(async () => {
    // 테스트 후 연결 해제 및 컨테이너 정지
    await prisma.$disconnect();
  });
});
