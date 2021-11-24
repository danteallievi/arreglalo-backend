import { getProfessionals } from "./professionalControllers";
import Professional from "../../DB/models/professional";
import { mockResponse, mockRequest } from "../../utils/mock/mockFunctions";

jest.mock("../../DB/models/professional");

describe("Given the getUsers function", () => {
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
      const error = new Error("Error loading the users");

      Professional.find = jest.fn().mockRejectedValue(null);
      await getProfessionals(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
