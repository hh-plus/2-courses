import { PrismaService } from '@/prisma/prisma.service';
import { AppModule } from '@/src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';
import { setDate } from './utils/setDate';
import { setupPrismaService } from './utils/setTestContainer';
import { PrismaClient } from '@prisma/client';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

describe('Courses', () => {
  let app: INestApplication;

  let container: StartedPostgreSqlContainer;
  let prisma: PrismaClient;

  let createCourse = null;

  jest.setTimeout(10000);

  beforeEach(async () => {
    ({ container, prisma } = await setupPrismaService());
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    moduleFixture.useLogger(false);

    createCourse = async ({
      title,
      maxUsers,
      calcurateStartDateNumber,
    }: {
      title: string;
      maxUsers: number;
      calcurateStartDateNumber?: number;
    }) => {
      const startDate = setDate(calcurateStartDateNumber || 1);

      return await prisma.course.create({
        data: {
          title,
          maxUsers,
          startDate,
        },
      });
    };

    // 테스트 전에 데이터를 모두 삭제한다.
  });

  describe('GET /courses', () => {
    it('정상적으로 강의 목록을 가져온다.', async () => {
      await createCourse({
        title: '특강',
        maxUsers: 5,
      });

      await createCourse({
        title: '특강2',
        maxUsers: 5,
      });

      const res = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      expect(res.body.length).toBe(2);
    });
  });

  it('특강에 신청을 하면 저장되어야 한다.', async () => {
    const userCount = 11;
    const newCourse = await createCourse({
      title: '특강',
      maxUsers: userCount,
    });

    const user = [];
    for (let i = 1; i <= userCount; i++) {
      const newUser = await prisma.user.create({
        data: {},
      });
      user.push(newUser);
    }

    await request(app.getHttpServer())
      .post(`/courses/apply/${newCourse.id}`)
      .query({ userId: user[0].id })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/courses/apply/${newCourse.id}`)
      .query({ userId: user[1].id })
      .expect(201);
  });

  it('정원이 초과되면 에러를 던져야 한다.', async () => {
    const newCourse = await createCourse({
      title: '특강',
      maxUsers: 1,
    });

    const user1 = await prisma.user.create({
      data: {},
    });

    const user2 = await prisma.user.create({
      data: {},
    });

    await request(app.getHttpServer())
      .post(`/courses/apply/${newCourse.id}`)
      .query({ userId: user1.id })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/courses/apply/${newCourse.id}`)
      .query({ userId: user2.id })
      .expect(500);
  });

  describe('동시성 테스트', () => {
    it('짧은 시간에 여러 요청이 들어와도 정원에 맞는 인원만을 성공으로 처리해야하고 나머지는 실패해야한다.', async () => {
      const newCourse = await createCourse({
        title: '특강',
        maxUsers: 5,
      });

      const userCount = 5;
      const userIds = [];
      for (let i = 1; i <= userCount; i++) {
        const newUser = await prisma.user.create({
          data: {},
        });
        userIds.push(newUser.id);
      }

      try {
        await Promise.all(
          userIds.map(async (userId) => {
            return await request(app.getHttpServer())
              .post(`/courses/apply/${newCourse.id}`)
              .query({ userId });
          }),
        );
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it('수를 늘려본다', async () => {
      const newCourse = await createCourse({
        title: '특강',
        maxUsers: 10,
      });

      const userCount = 11;
      const userIds = [];
      for (let i = 1; i <= userCount; i++) {
        const newUser = await prisma.user.create({
          data: {},
        });
        userIds.push(newUser.id);
      }

      try {
        await Promise.all(
          userIds.map(async (userId) => {
            return await request(app.getHttpServer())
              .post(`/courses/apply/${newCourse.id}`)
              .query({ userId });
          }),
        );
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  afterEach(async () => {
    await container.stop();
  });
});
