import {
  getProfessionals,
  getProfessionalClients,
} from "./professionalControllers";
import Professional from "../../DB/models/professional";
import { mockResponse, mockRequest } from "../../utils/mock/mockFunctions";
import { RequestAuth } from "../../interfaces/auth/requestAuth";
import CustomError from "../../interfaces/error/customError";

jest.mock("../../DB/models/professional");

describe("Given the getProfessionals function", () => {
  describe("When it receives a res object and a resolved promise", () => {
    test("Then it should call the method json with status 200", async () => {
      const res = mockResponse();
      const req = mockRequest();
      const expectedReturn = [{ name: "test" }];
      const expectedStatus = 200;

      Professional.find = jest.fn().mockResolvedValue(expectedReturn);
      await getProfessionals(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedReturn);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a rejected promise", () => {
    test("Then it should call the next function with the expected error", async () => {
      const req = mockRequest();
      const next = jest.fn();
      const error = new Error("Error loading the professionals.");

      Professional.find = jest.fn().mockRejectedValue(null);
      await getProfessionals(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given the getProfessionalClients function", () => {
  describe("When it receives a req object with a valid id ", () => {
    test("Then it should call the method json with the user with status 200", async () => {
      const res = mockResponse();
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedReturn = [{ name: "test" }];
      const expectedStatus = 200;

      Professional.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(expectedReturn),
      });
      await getProfessionalClients(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedReturn);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a req object with a valid id but the promise rejects", () => {
    test("Then it should call the method json with the user with status 500", async () => {
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedError = new CustomError("Error getting the clients.");
      expectedError.code = 500;
      const next = jest.fn();

      Professional.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(null),
      });
      await getProfessionalClients(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When it receives a req object with a valid id but the promise rejects", () => {
    test("Then it should call the method json with the user with status 500", async () => {
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedError = new CustomError("Professional not found.");
      expectedError.code = 404;
      const next = jest.fn();

      Professional.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      await getProfessionalClients(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});
