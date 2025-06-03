import { INestApplication, ValidationPipe } from '@nestjs/common';
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

    // Configure the same ValidationPipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip properties that don't have decorators
        forbidNonWhitelisted: false, // Allow extra properties to be stripped instead of throwing error
        transform: true, // Automatically transform payloads to DTO instances
        transformOptions: {
          enableImplicitConversion: true, // Allow implicit type conversion
        },
      }),
    );

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(/Visitor count: \d+/);
  });

  it('/visitor (POST) - valid IPv4 address', () => {
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

  it('/visitor (POST) - valid IPv6 address', () => {
    return request(app.getHttpServer())
      .post('/visitor')
      .send({ ipAddress: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Visitor data recorded successfully');
        expect(res.body.ipAddress).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
        expect(res.body.timestamp).toBeDefined();
      });
  });

  it('/visitor (POST) - invalid IP address should return 400', () => {
    return request(app.getHttpServer())
      .post('/visitor')
      .send({ ipAddress: 'invalid-ip' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('Invalid IP address format');
      });
  });

  it('/visitor (POST) - missing IP address should return 400', () => {
    return request(app.getHttpServer())
      .post('/visitor')
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('IP address is required');
      });
  });

  it('/visitor (POST) - empty IP address should return 400', () => {
    return request(app.getHttpServer())
      .post('/visitor')
      .send({ ipAddress: '' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('IP address is required');
      });
  });

  it('/visitor (POST) - non-string IP address should return 400', () => {
    return request(app.getHttpServer())
      .post('/visitor')
      .send({ ipAddress: 123 })
      .expect(400)
      .expect((res) => {
        // The @IsIP() validator runs first and fails before @IsString()
        expect(res.body.message).toContain('Invalid IP address format');
      });
  });

  it('/visitor (POST) - extra properties should be stripped', () => {
    return request(app.getHttpServer())
      .post('/visitor')
      .send({
        ipAddress: '192.168.1.1',
        extraProperty: 'should be removed'
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Visitor data recorded successfully');
        expect(res.body.ipAddress).toBe('192.168.1.1');
        expect(res.body.timestamp).toBeDefined();
      });
  });
});
