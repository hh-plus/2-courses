import { PrismaService } from '@/prisma/prisma.service';
import { AppModule } from '@/src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';
import { setDate } from './utils/setDate';

describe('Courses', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  let createCourse = null;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    moduleFixture.useLogger(false);

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

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

      return await prismaService.course.create({
        data: {
          title,
          maxUsers,
          startDate,
        },
      });
    };

    // 테스트 전에 데이터를 모두 삭제한다.
    await prismaService.courseUser.deleteMany();
    await prismaService.course.deleteMany();
    await prismaService.user.deleteMany();
  });

  it('특강에 신청을 하면 저장되어야 한다.', async () => {
    const userCount = 11;
    const newCourse = await createCourse({
      title: '특강',
      maxUsers: userCount,
    });

    for (let i = 1; i <= userCount; i++) {
      await prismaService.user.create({
        data: {
          id: i,
        },
      });
    }

    await request(app.getHttpServer())
      .post(`/courses/apply/${newCourse.id}`)
      .query({ userId: 1 })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/courses/apply/${newCourse.id}`)
      .query({ userId: 2 })
      .expect(201);
  });

  it('정원이 초과되면 에러를 던져야 한다.', async () => {
    const newCourse = await createCourse({
      title: '특강',
      maxUsers: 1,
    });

    await prismaService.user.create({
      data: {
        id: 1,
      },
    });

    await prismaService.user.create({
      data: {
        id: 2,
      },
    });

    await request(app.getHttpServer())
      .post(`/courses/apply/${newCourse.id}`)
      .query({ userId: 1 })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/courses/apply/${newCourse.id}`)
      .query({ userId: 2 })
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
        await prismaService.user.create({
          data: {
            id: i,
          },
        });
        userIds.push(i);
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
        await prismaService.user.create({
          data: {
            id: i,
          },
        });
        userIds.push(i);
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
    await prismaService.courseUser.deleteMany();
    await prismaService.course.deleteMany();
    await prismaService.user.deleteMany();
    await app.close();
  });
});
