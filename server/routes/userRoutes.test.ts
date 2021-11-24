import dotenv from "dotenv";

dotenv.config();

import Debug from "debug";
import chalk from "chalk";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import supertest from "supertest";

import { initializeServer, app } from "../index";
import initializeDB from "../../DB";
import Professional from "../../DB/models/professional";
import Client from "../../DB/models/client";

const debug = Debug("Arreglalo:Test");
const request = supertest(app);
let server;
let token;

beforeAll(async () => {
  await initializeDB(process.env.DB_STRING_TEST);
  server = await initializeServer(9700);

  await Professional.create({
    name: "test",
    surname: "test",
    password: await bcrypt.hash("test", 10),
    DNI: "123",
    dateOfBirth: "123",
    email: "a@a.com",
    phone: "123",
    address: {
      street: "1",
      city: "2",
      zip: "3",
    },
    skills: ["a", "b"],
  });

  const loginResponse = await request
    .post("/user/login")
    .send({ email: "a@a.com", password: "test" })
    .expect(200);
  token = loginResponse.body.token;
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    debug(chalk.red("Server connection closed."));
    done();
  });
});

beforeEach(async () => {
  await Professional.deleteMany({});
  await Client.deleteMany({});
});

afterEach(async () => {
  await Professional.deleteMany({});
  await Client.deleteMany({});
});

describe("Given a /user/login endpoint", () => {
  describe("When it receive POST request with a bad username and password", () => {
    test("Then it should respond with a 401 error", async () => {
      const { body } = await request
        .post("/user/login")
        .send({ email: "a@a.com", password: "a wrong password" })
        .expect(401);

      const expectedError = {
        error: "Wrong credentials.",
      };

      expect(body).toEqual(expectedError);
    });
  });
});

describe("Given a /user/professional/register endpoint", () => {
  describe("When it receive a POST request with a valid body", () => {
    test("Then it should return a status 201", async () => {
      const expectedProfessional = {
        name: "test",
        surname: "test",
        password: "test",
        DNI: "123",
        dateOfBirth: "123",
        email: "a@a.com",
        phone: "123",
        address: {
          street: "1",
          city: "2",
          zip: "3",
        },
        skills: ["a", "b"],
      };

      await request
        .post("/user/professional/register")
        .send(expectedProfessional)
        .expect(201);
    });
  });

  describe("When it receive a POST request with a invalid body", () => {
    test("Then it should return status 400", async () => {
      const expectedUser = {
        name: "test",
      };

      await request
        .post("/user/professional/register")
        .send(expectedUser)
        .expect(400);
    });
  });

  describe("Given a /user/client/register", () => {
    describe("When it receive a POST request with a valid body", () => {
      test("Then it should return status 201", async () => {
        const expectedUser = {
          name: "test",
          surname: "test",
          password: "test",
          DNI: "123",
          dateOfBirth: "123",
          email: "te@st.com",
          phone: "123",
          address: {
            street: "1",
            city: "2",
            zip: "3",
          },
        };

        await request
          .post("/user/client/register")
          .send(expectedUser)
          .expect(201);
      });
    });

    describe("When it receive a POST request with a invalid body", () => {
      test("Then it should return status 400", async () => {
        const expectedUser = {
          name: "test",
        };

        await request
          .post("/user/client/register")
          .send(expectedUser)
          .expect(400);
      });
    });

    describe("When it receive a POST request with a valid body but existing email", () => {
      beforeEach(async () => {
        await Client.create({
          name: "test",
          surname: "test",
          password: "test",
          DNI: "123",
          dateOfBirth: "123",
          email: "a@a.com",
          phone: "123",
          address: {
            street: "1",
            city: "2",
            zip: "3",
          },
        });
      });
      test("Then it should return status 400", async () => {
        const existingUser = {
          name: "test",
          surname: "test",
          password: "test",
          DNI: "123",
          dateOfBirth: "123",
          email: "a@a.com",
          phone: "123",
          address: {
            street: "1",
            city: "2",
            zip: "3",
          },
        };
        await request
          .post("/user/client/register")
          .send(existingUser)
          .expect(403);
      });
    });
  });
});
