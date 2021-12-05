import { Request } from "express";

import {
  getProfessionals,
  getProfessional,
  getProfessionalClients,
  deleteProfessionalProfile,
  updateProfessionalProfile,
  rateProfessional,
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
      const req = {} as RequestAuth;
      req.userData = {
        id: 1,
        email: "a",
        name: "a",
        surname: "a",
      };
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
      const req = {} as RequestAuth;
      req.userData = {
        id: 1,
        email: "a",
        name: "a",
        surname: "a",
      };
      const next = jest.fn();
      const error = new Error("Error loading the professionals.");

      Professional.find = jest.fn().mockRejectedValue(null);
      await getProfessionals(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given the getProfessional function", () => {
  describe("When it receives a res, req object and a resolved promise", () => {
    test("Then it should call the method json with status 200", async () => {
      const res = mockResponse();
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const expectedReturn = { name: "test" };
      const expectedStatus = 200;

      Professional.findById = jest.fn().mockResolvedValue(expectedReturn);
      await getProfessional(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedReturn);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a res, req object and a rejected promise", () => {
    test("Then it should call the next function with expected error and status 404", async () => {
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const expectedError = new CustomError("Professional not found.");
      const next = jest.fn();

      Professional.findById = jest.fn().mockResolvedValue(null);
      await getProfessional(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 404);
    });
  });

  describe("When it receives a res, req object and a rejected promise", () => {
    test("Then it should call the next function with expected error and status 404", async () => {
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const expectedError = new Error("Error loading the professionals.");
      const next = jest.fn();

      Professional.findById = jest.fn().mockRejectedValue(null);
      await getProfessional(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the getProfessionalClients function", () => {
  describe("When it receives a logged user, a req and res objects", () => {
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
    test("Then it should call the next function with expected erorr and status 500", async () => {
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedError = new CustomError(
        "Error getting the professional clients."
      );
      const next = jest.fn();

      Professional.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(null),
      });
      await getProfessionalClients(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a next function a req object with a invalid id", () => {
    test("Then it should call the next function with the expected error and status 404", async () => {
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

describe("Given the deleteProfessionalProfile function", () => {
  describe("When it receives a logged user and a req, res object", () => {
    test("Then it should call the method json with the expected message", async () => {
      const res = mockResponse();
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedMessage = "Professional deleted.";
      const expectedStatus = 200;

      Professional.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue({ name: "test" });
      await deleteProfessionalProfile(req, res, null);

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a invalid id", () => {
    test("Then it should call the next function with the expected error and status 404", async () => {
      const next = jest.fn();
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedError = new CustomError("Professional not found.");
      const expectedCode = 404;

      Professional.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      await deleteProfessionalProfile(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedCode);
    });
  });

  describe("When it receives rejected promise", () => {
    test("Then it should call the next function with the expected error", async () => {
      const next = jest.fn();
      const req = {
        userData: {
          id: 1,
        },
      } as RequestAuth;
      const expectedError = new Error("Error deleting the professional.");

      Professional.findByIdAndDelete = jest.fn().mockRejectedValue(null);
      await deleteProfessionalProfile(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the updateProfessionalProfile function", () => {
  describe("When it receives a req, res objects and a valid userId", () => {
    test("Then it should call the json method with the updated profissional", async () => {
      const expectedUser = {
        name: "test",
      };
      const expectedStatus = 200;
      const res = mockResponse();
      const req = {
        userData: {
          id: "1",
        },
        body: expectedUser,
      } as RequestAuth;

      Professional.findByIdAndUpdate = jest.fn().mockResolvedValue({
        name: "test",
      });
      await updateProfessionalProfile(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedUser);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a req object with a invalid userId", () => {
    test("Then it should call the next function with the expected error and status 404", async () => {
      const req = {
        userData: {
          id: "1",
        },
        body: {
          name: "test",
        },
      } as RequestAuth;
      const next = jest.fn();
      const expectedStatus = 404;
      const expectedError = new CustomError("Professional not found.");

      Professional.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      await updateProfessionalProfile(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedStatus);
    });
  });

  describe("When it receives a req object with a valid userId but the promise rejects", () => {
    test("Then it should call the next function with the expected error", async () => {
      const req = {
        userData: {
          id: "1",
        },
        body: {
          name: "test",
        },
      } as RequestAuth;
      const next = jest.fn();
      const expectedError = new Error(
        "Error updating the professional profile."
      );

      Professional.findByIdAndUpdate = jest.fn().mockRejectedValue(null);
      await updateProfessionalProfile(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the rateProfessional function", () => {
  describe("When it receives a req and res objects with a valid user", () => {
    test("Then it should call the json method with the user and a status 200", async () => {
      const res = mockResponse();
      const req = {} as Request;
      req.body = { name: "test", rate: 3 };
      req.params = { id: "1" };
      const expectedStatus = 200;

      Professional.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);
      await rateProfessional(req, res, null);

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a req object and next function with a invalid user", () => {
    test("Then it should call the next function with the expected error", async () => {
      const req = {} as Request;
      req.body = { name: "test", rate: 3 };
      req.params = { id: "1" };
      const expectedError = new CustomError("Professional not found.");
      const expectedStatus = 404;
      const next = jest.fn();

      Professional.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      await rateProfessional(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedStatus);
    });
  });

  describe("When it receives a req object and next function with a rejected promise", () => {
    test("Then it should call the next function with the expected error", async () => {
      const req = {} as Request;
      req.body = { name: "test", rate: 3 };
      req.params = { id: "1" };
      const expectedError = new Error("Error updating the professional rate.");
      const next = jest.fn();

      Professional.findByIdAndUpdate = jest.fn().mockRejectedValue(null);
      await rateProfessional(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
