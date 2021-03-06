import jwt from "jsonwebtoken";

import { mockAuthRequest } from "../utils/mock/mockFunctions";
import checkAuthorization from "./checkAuthorization";
import CustomError from "../interfaces/error/customError";

jest.mock("jsonwebtoken");

describe("Given a checkAuthorization function", () => {
  describe("When it receives an unauthorized request", () => {
    test("Then it should return error code 401 and Unauthorized message", () => {
      const req = mockAuthRequest(null, null);
      const error = new CustomError("Unauthorized.");
      error.code = 401;
      const next = jest.fn();

      checkAuthorization(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a Authorization request without token ", () => {
    test("Then it should return error code 401 and Unauthorized message", () => {
      const req = mockAuthRequest(null, "1");
      const error = new CustomError("Unauthorized.");
      error.code = 401;
      const next = jest.fn();

      checkAuthorization(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a Authorization request with good token ", () => {
    test("Then it should invoke the next function without error", () => {
      const req = mockAuthRequest(
        null,
        "Bearer DGhKdN5jBP2ndIeLQpXumjYHCAkx0UeIGVAJMLhAJLc"
      );
      jwt.verify = jest.fn().mockReturnValue({
        id: "1",
        username: "toto",
        name: "toto",
        friends: [],
        enemies: [],
      });

      const next = jest.fn();
      checkAuthorization(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a Authorization request with wrong token ", () => {
    test("Then it should invoke next function with error and return error code 401 and Unauthorized message", () => {
      const req = mockAuthRequest(null, "Bearer 123");
      const next = jest.fn();
      const expectedError = new CustomError("Unauthorized.");
      expectedError.code = 401;

      jwt.verify = jest.fn().mockReturnValue(null);
      checkAuthorization(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});
