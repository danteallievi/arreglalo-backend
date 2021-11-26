import IError from "../interfaces/error/error";
import { notFoundErrorHandler, generalErrorHandler } from "./errors";

interface IResponseTest {
  status: () => void;
  json: () => void;
}

const mockResponse = () => {
  const res: IResponseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given a notFoundErrorHandler", () => {
  describe("When it receives a null request", () => {
    test("Then it should return error code 404 and 'Endpoint not found'", () => {
      const res = mockResponse();

      notFoundErrorHandler(null, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Endpoint not found" });
    });
  });
});

describe("Given a generalErrorHandler", () => {
  describe("When it receives an error without instanceof ValidationError, without error code and message", () => {
    test("Then it should return error code 500 and 'General error' message", () => {
      const res = mockResponse();
      const error = new Error("General error") as IError;

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "General error" });
    });
  });

  describe("Wh", () => {
    test("T", () => {
      const res = mockResponse();
      const error = new Error("Bad request") as IError;
      error.statusCode = 400;

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(error.statusCode);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
