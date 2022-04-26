import { Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Professional from "../../DB/models/professional";
import Client from "../../DB/models/client";

import CustomError from "../../interfaces/error/customError";
import { createClient, createProfessional, loginUser } from "./userControllers";
import { mockResponse, RequestFile } from "../../utils/mock/mockFunctions";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../DB/models/client");
jest.mock("../../DB/models/professional");

describe("Given the createProfessional controller", () => {
  describe("When it recibes a request with a invalid body", () => {
    test("Then it should call the next function with the expected error", async () => {
      const req = {} as RequestFile;
      req.body = { password: "123456" };
      req.file = { fileURL: "asd.jpg" };
      const next = jest.fn();
      const expectedError = new Error("Error creating the professional");

      await createProfessional(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it recibes a request with a valid body", () => {
    test("Then it should call the res method with the professional created and code 201", async () => {
      const req = {} as RequestFile;
      req.body = {
        name: "test",
        surname: "test",
        password: "test",
        avatar: "asd",
        DNI: "test",
        dateOfBirth: "test",
        email: "test",
        phone: "test",
        address: {
          street: "test",
          number: "test",
          zip: "test",
        },
        skills: [],
      };
      req.file = { fileURL: "asd.jpg" };
      const res = mockResponse();
      const expectedStatus = 201;

      Professional.create = jest.fn().mockResolvedValue(req.body);
      await createProfessional(req, res, null);

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it recibes a request with a valid body but the email already exists", () => {
    test("Then it should call the next function with the expected error and code 403", async () => {
      const req = {} as RequestFile;
      req.body = {
        name: "test",
        surname: "test",
        password: "test",
        avatar: "asd",
        DNI: "test",
        dateOfBirth: "test",
        email: "test",
        phone: "test",
        address: {
          street: "test",
          number: "test",
          zip: "test",
        },
        skills: [],
      };
      req.file = { fileURL: "asd.jpg" };
      const next = jest.fn();
      const expectedError = new CustomError("Email already exist.");
      expectedError.code = 403;

      Professional.findOne = jest.fn().mockResolvedValue(true);
      Professional.create = jest.fn().mockResolvedValue(req.body);
      await createProfessional(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0].code).toBe(expectedError.code);
    });
  });
});

describe("Given the loginUser controller", () => {
  describe("When it receives a user and is not valid", () => {
    test("Then it should call the next function with the expected error and status 401", async () => {
      const req = {} as RequestFile;
      req.body = {
        name: "test",
        surname: "test",
        password: "test",
        avatar: "asd",
        DNI: "test",
        dateOfBirth: "test",
        email: "test",
        phone: "test",
        address: {
          street: "test",
          number: "test",
          zip: "test",
        },
        skills: [],
      };
      req.file = { fileURL: "asd.jpg" };
      const next = jest.fn();
      const expectedError = new CustomError("Wrong credentials.");

      Professional.findOne = jest.fn().mockResolvedValue(null);
      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
    });
  });

  describe("When it receives a valid user but the password is not valid", () => {
    test("Then it should call the next function with the expected error and status 401", async () => {
      const req = {
        body: {
          email: "test",
          password: "123456",
        },
      } as Request;
      const next = jest.fn();
      const expectedError = new CustomError("Wrong credentials.");

      Professional.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
    });
  });

  describe("When it receives a valid user and a valid password", () => {
    test("Then it should response with the method json and the token", async () => {
      const req = {
        body: {
          email: "test",
          password: "test",
        },
      } as Request;
      const res = mockResponse();
      const expectedToken = 123;

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      Professional.findOne = jest.fn().mockResolvedValue(req.body);
      await loginUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });
  });

  describe("When it receives rejected promise", () => {
    test("Then it should call the next function with the expected error", async () => {
      const req = {
        body: {
          email: "test",
          password: "test",
        },
      } as Request;
      const expectedError = new Error("Error logging in the user.");

      const next = jest.fn();
      Professional.findOne = jest.fn().mockRejectedValue(null);
      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the createClient controller", () => {
  describe("When it recibes a request with a invalid body", () => {
    test("Then it should call the next function with the expected error", async () => {
      const req = {} as RequestFile;
      req.body = {
        password: "1",
      };
      req.file = { fileURL: "asd.jpg" };
      const next = jest.fn();
      const expectedError = new Error("Error creating the client.");
      const mockedProfessional = Professional as jest.Mocked<
        typeof Professional
      >;
      const mockedClient = Client as jest.Mocked<typeof Client>;

      mockedProfessional.findOne.mockResolvedValue(null);
      mockedClient.findOne.mockResolvedValue(null);
      await createClient(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it recibes a request with a valid body", () => {
    test("Then it should call the res method with the client created and code 201", async () => {
      const req = {} as RequestFile;
      req.body = {
        name: "test",
        surname: "test",
        password: "test",
        avatar: "asd",
        DNI: "test",
        dateOfBirth: "test",
        email: "test",
        phone: "test",
        address: {
          street: "test",
          number: "test",
          zip: "test",
        },
        skills: [],
      };
      req.file = { fileURL: "asd.jpg" };
      const res = mockResponse();
      const expectedStatus = 201;

      Client.create = jest.fn().mockResolvedValue(req.body);
      await createClient(req, res, null);

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it recibes a request with a valid body but the email already exists", () => {
    test("Then it should call the next function with the expected error and code 403", async () => {
      const req = {} as RequestFile;
      req.body = {
        name: "test",
        surname: "test",
        password: "test",
        avatar: "asd",
        DNI: "test",
        dateOfBirth: "test",
        email: "test",
        phone: "test",
        address: {
          street: "test",
          number: "test",
          zip: "test",
        },
        skills: [],
      };
      req.file = { fileURL: "asd.jpg" };
      const next = jest.fn();
      const expectedError = new CustomError("Email already exist.");
      expectedError.code = 403;

      Client.findOne = jest.fn().mockResolvedValue(true);
      Client.create = jest.fn().mockResolvedValue(req.body);
      await createClient(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0].code).toBe(expectedError.code);
    });
  });
});
