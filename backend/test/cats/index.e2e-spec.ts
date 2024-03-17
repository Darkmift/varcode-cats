// cats.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CatsModule } from '@/cats/cats.module';

describe.skip('CatsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CatsModule], // Assuming your CatsModule imports CatsController and CatsService
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/cats/top-five (GET) should return top five cats', () => {
    return request(app.getHttpServer())
      .get('/cats/top-five')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeLessThanOrEqual(5); // Assuming the service returns up to 5 cats
        res.body.forEach((cat) => {
          expect(cat).toHaveProperty('id');
          expect(cat).toHaveProperty('name');
        });
      });
  });

  it('/cats/search (GET) should return paginated cat results', () => {
    return request(app.getHttpServer())
      .get('/cats/search?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.items)).toBeTruthy();
        expect(res.body).toHaveProperty('total');
        expect(res.body.items.length).toBeLessThanOrEqual(10);
      });
  });

  it('/cats/get-by-id (GET) should return a cat by ID', () => {
    const testCatId = '1'; // Replace with a valid cat ID after seeding test data
    return request(app.getHttpServer())
      .get(`/cats/get-by-id?id=${testCatId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', testCatId);
      });
  });

  // Additional tests for voting and removing votes can be implemented similarly,
  // but you'd likely need to handle authentication within your e2e tests for routes guarded by JwtAuthGuard.

  afterAll(async () => {
    await app.close();
  });
});
