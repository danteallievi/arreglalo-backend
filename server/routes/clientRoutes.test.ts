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
let clientToken;

jest.setTimeout(30000);

beforeAll(async () => {
  await initializeDB(process.env.DB_STRING_TEST);

  await Client.deleteMany({});
  await Professional.deleteMany({});

  server = await initializeServer(6666);

  await Client.create({
    _id: "619fae64251f9aef1e489728",
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
  });
});

afterAll((done) => {
  server.close(async () => {
    await Professional.deleteMany({});
    await Client.deleteMany({});
    await mongoose.connection.close();
    debug(chalk.red("Server connection closed."));
    done();
  });
});

beforeEach(async () => {
  await Client.deleteMany({});
  await Professional.deleteMany({});

  await Client.create({
    _id: "619fae64251f9aef1e486789",
    name: "client",
    surname: "client",
    password: await bcrypt.hash("client", 10),
    DNI: "123",
    dateOfBirth: "123",
    email: "client@client.com",
    phone: "123",
    address: {
      street: "1",
      city: "2",
      zip: "3",
    },
    professionals: [],
  });

  const loginResponse = await request
    .post("/user/login")
    .send({ email: "client@client.com", password: "client" })
    .expect(200);
  clientToken = loginResponse.body.token;

  await Professional.create({
    _id: "619fae64251f9aef1e489123",
    name: "prof",
    surname: "prof",
    password: await bcrypt.hash("prof", 10),
    DNI: "123",
    dateOfBirth: "123",
    email: "profe@profe.com",
    phone: "123",
    address: {
      street: "1",
      city: "2",
      zip: "3",
    },
    skills: ["a", "b"],
  });
});

describe("Given a /client endpoint", () => {
  describe("When it receive GET request with authorized user", () => {
    test("Then it should respond with a professionals array and status 200", async () => {
      const { body } = await request
        .get("/client")
        .set("Authorization", `Bearer ${clientToken}`)
        .expect(200);

      expect(body[0]).toHaveProperty("name");
    });
  });

  describe("When it receive GET request with unauthorized user", () => {
    test("Then it should respond with a status 401", async () => {
      await request.get("/client").set("Authorization", `Bearer 1`).expect(401);
    });
  });
});

describe("Given a /client/professionals endpoint", () => {
  describe("When it receives a authorized user", () => {
    test("Then it should respond with the professionals and status 200", async () => {
      const { body } = await request
        .get("/client/professionals")
        .set("Authorization", `Bearer ${clientToken}`)
        .expect(200);

      expect(body).toHaveProperty("name");
    });
  });

  describe("When it receives a unauthorized user", () => {
    test("Then it should respond with status 401", async () => {
      await request
        .get("/client/professionals")
        .set("Authorization", `Bearer 123`)
        .expect(401);
    });
  });
});

describe("Given a /client/hire endpoint", () => {
  describe("When it receives a authorized user and a valid ID", () => {
    test("Then it should respond with the professional and status 200", async () => {
      const { body } = await request
        .post("/client/hire/619fae64251f9aef1e489123")
        .set("Authorization", `Bearer ${clientToken}`)
        .expect(200);

      expect(body).toHaveProperty("name");
    });
  });

  describe("When it receives a authorized user and a valid ID", () => {
    test("Then it should respond with status 401", async () => {
      await request
        .post("/client/hire/619fae64251f9aef1e489123")
        .set("Authorization", `Bearer 123`)
        .expect(401);
    });
  });
});

describe("Given a /client/eject endpoint", () => {
  describe("When it receives a authorized user and a valid ID", () => {
    test("Then it should respond with the professional and status 200", async () => {
      const { body } = await request
        .post("/client/eject/619fae64251f9aef1e489123")
        .set("Authorization", `Bearer ${clientToken}`)
        .expect(200);

      expect(body).toHaveProperty("name");
    });
  });

  describe("When it receives a authorized user and a valid ID", () => {
    test("Then it should respond with status 401", async () => {
      await request
        .post("/client/eject/619fae64251f9aef1e489123")
        .set("Authorization", `Bearer 123`)
        .expect(401);
    });
  });
});
