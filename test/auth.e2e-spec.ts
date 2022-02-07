import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handels a signup request', () => {
    const emailToTest = "emaildfg@email.com";

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: emailToTest, password: "password" })
      .expect(201)
      .then(res => {
        const { id, email } = res.body;
        expect(id).toBeDefined()
        expect(email).toEqual(emailToTest);
      })
  });

  it("signup as a new user then get the currently logged in user", async () => {
    const email = "email1@email.com";
    const res = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email, password: "password" })
      .expect(201)

    const cookie = res.get("Set-Cookie"); // get the cookie from the header;

    const { body } = await request(app.getHttpServer())
      .get("/auth/whoami")
      .set("Cookie", cookie)
      .expect(200)

    expect(body.email).toEqual(email);
  })
});
