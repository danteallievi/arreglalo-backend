import Client from "../../DB/models/client";
import { getClients, getClientProfessionals } from "./client";
import { mockResponse, mockRequest } from "../../utils/mock/mockFunctions";
import { RequestAuth } from "../../interfaces/auth/requestAuth";
import CustomError from "../../interfaces/error/customError";

jest.mock("../../DB/models/client");

describe("Given the getClients function", () => {
  describe("When it receives a res object and the promise resolves", () => {
    test("Then it should call the method json with status 200", async () => {
      const res = mockResponse();
      const req = mockRequest();
      const expectedReturn = [{ name: "test" }];
      const expectedStatus = 200;

      Client.find = jest.fn().mockResolvedValue(expectedReturn);
      await getClients(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedReturn);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When the promise rejects", () => {
    test("Then it should call the next function with the expected error", async () => {
      const req = mockRequest();
      const next = jest.fn();
      const error = new Error("Error loading the clients.");

      Client.find = jest.fn().mockRejectedValue(null);
      await getClients(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given the getClientProfessionals function", () => {
  describe("When it receives a logged user and a res object", () => {
    test("Then it should call the method json with the user and status 200", async () => {
      const res = mockResponse();
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedReturn = [{ name: "test" }];
      const expectedStatus = 200;

      Client.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(expectedReturn),
      });
      await getClientProfessionals(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedReturn);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a logged user but the promise rejects", () => {
    test("Then it should call the next function with the expected error and status 500", async () => {
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedError = new CustomError(
        "Error getting the client professionals."
      );
      const expectedCode = 500;
      const next = jest.fn();

      Client.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(null),
      });
      await getClientProfessionals(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedCode);
    });
  });

  describe("When it receives a invalid user", () => {
    test("Then it should call the next function with expected error and status 404", async () => {
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedError = new CustomError("Client not found.");
      const expectedCode = 404;
      const next = jest.fn();

      Client.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      await getClientProfessionals(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedCode);
    });
  });
});
