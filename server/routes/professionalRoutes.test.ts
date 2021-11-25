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
let professionalToken;

beforeAll(async () => {
  await initializeDB(process.env.DB_STRING_TEST);

  await Professional.deleteMany({});

  server = await initializeServer(9999);

  await Professional.create({
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
    skills: ["a", "b"],
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
  await Professional.deleteMany({});
  await Professional.create({
    _id: "619fae64251f9aef1e481234",
    name: "professional",
    surname: "professional",
    password: await bcrypt.hash("professional", 10),
    DNI: "123",
    dateOfBirth: "123",
    email: "professional@professional.com",
    phone: "123",
    address: {
      street: "1",
      city: "2",
      zip: "3",
    },
    skills: ["a", "b"],
    clients: [],
  });

  const loginResponse = await request
    .post("/user/login")
    .send({ email: "professional@professional.com", password: "professional" })
    .expect(200);
  professionalToken = loginResponse.body.token;
});

describe("Given a /professional endpoint", () => {
  describe("When it receive GET request", () => {
    test("Then it should respond with a professionals array and status 200", async () => {
      const { body } = await request.get("/professional").expect(200);

      expect(body[0]).toHaveProperty("name");
    });
  });
});

describe("Given a /professional/:id endpoint", () => {
  describe("When it receive GET request with a valid ID", () => {
    test("Then it should respond with one professional and status 200", async () => {
      const { body } = await request
        .get("/professional/619fae64251f9aef1e481234")
        .expect(200);

      expect(body).toHaveProperty("name");
    });
  });

  describe("When it receive GET request with a invalid ID", () => {
    test("Then it should respond with status 404", async () => {
      const { body } = await request
        .get("/professional/619fae64251f9aef1e486668")
        .expect(404);

      expect(body).toEqual({ error: "Professional not found." });
    });
  });
});

describe("Given the /professional/delete", () => {
  describe("When it receive DELETE request", () => {
    test("Then it should respond with status 200", async () => {
      const { body } = await request
        .delete("/professional/delete")
        .set("Authorization", `Bearer ${professionalToken}`)
        .expect(200);

      expect(body).toEqual({ message: "Professional deleted." });
    });
  });

  describe("When it receive DELETE request with invalid token", () => {
    test("Then it should respond with status 401", async () => {
      await request
        .delete("/professional/delete")
        .set("Authorization", `Bearer 123`)
        .expect(401);
    });
  });
});

describe("Given the /professional/update", () => {
  describe("When it receive PUT request with the user to update", () => {
    test("Then it should respond with status 200", async () => {
      const userToUpdate = {
        name: "fuck",
        surname: "supertest",
      };
      await request
        .put("/professional/update")
        .set("Authorization", `Bearer ${professionalToken}`)
        .send(userToUpdate)
        .expect(200);
    });
  });

  describe("When it receive PUT request with invalid token", () => {
    test("Then it should respond with status 401", async () => {
      await request
        .put("/professional/update")
        .set("Authorization", `Bearer 123`)
        .expect(401);
    });
  });
});

describe("Given the /professional/clients", () => {
  describe("When it receive GET request", () => {
    test("Then it should respond with status 200", async () => {
      await request
        .get("/professional/clients")
        .set("Authorization", `Bearer ${professionalToken}`)
        .expect(200);
    });
  });

  describe("When it receive PUT request with invalid token", () => {
    test("Then it should respond with status 401", async () => {
      await request
        .get("/professional/clients")
        .set("Authorization", `Bearer 123`)
        .expect(401);
    });
  });
});
