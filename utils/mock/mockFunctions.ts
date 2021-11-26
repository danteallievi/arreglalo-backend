import { Request, Response } from "express";
import { RequestAuth } from "../../interfaces/auth/requestAuth";

export const mockRequest = () => {
  const req = {} as Request;
  return req;
};

export const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

export const mockAuthRequest = (body?: any, header?: any) => {
  const req = {} as RequestAuth;
  req.body = body;
  req.header = jest.fn().mockReturnValue(header);
  return req;
};
