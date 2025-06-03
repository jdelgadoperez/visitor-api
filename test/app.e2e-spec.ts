import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(/Visitor count: \d+/);
  });

  it('/visitor (POST)', () => {
    return request(app.getHttpServer())
      .post('/visitor')
      .send({ ipAddress: '192.168.1.1' })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Visitor data recorded successfully');
        expect(res.body.ipAddress).toBe('192.168.1.1');
        expect(res.body.timestamp).toBeDefined();
      });
  });
});
