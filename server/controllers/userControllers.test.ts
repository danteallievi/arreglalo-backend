import Professional from "../../DB/models/professional";

import { createProfessional } from "./userControllers";

jest.mock("bcrypt");
jest.mock("../../DB/models/professional");

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

describe("Given the createProfessional controller", () => {
  describe("When it recibes a request with a invalid body", () => {
    test("Then it should call the next function with the expected error", async () => {
      const req = {
        body: {
          password: "123456",
        },
      };
      const next = jest.fn();
      const expectedError = new Error("Error creating the professional");
      await createProfessional(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it recibes a request with a valid body", () => {
    test("Then it should call the res method with the professional created", async () => {
      const req = {
        body: {
          name: "test",
          surname: "test",
          password: "test",
          DNI: "test",
          dateOfBirth: "test",
          email: "test",
          phone: "test",
          address: {
            street: "test",
            number: "test",
            zip: "test",
          },
        },
      };
      const res = mockResponse();
      const expectedStatus = 201;

      Professional.create = jest.fn().mockResolvedValue(req.body);
      await createProfessional(req, res, null);

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
});
