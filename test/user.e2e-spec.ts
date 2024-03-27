import { PrismaService } from '@/prisma/prisma.service';
import { AppModule } from '@/src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import * as request from 'supertest';
import { setDate } from './utils/setDate';

describe('User', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    moduleFixture.useLogger(false);

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // 테스트 전에 데이터를 모두 삭제한다.
    // await prismaService.courseUser.deleteMany();
    // await prismaService.course.deleteMany();
    // await prismaService.user.deleteMany();
  });

  // describe('참가 성공과 실패의 string을 반환한다.', () => {
  it('신청에 실패했으면 실패 메시지를 반환한다.', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/users`)
      .query({ userId: 1, courseId: 1 });

    expect(body.message).toBe('신청 실패..');
  });
  // });
});
