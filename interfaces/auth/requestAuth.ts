import express from "express";
import UserData from "./userData";

export interface RequestAuth extends express.Request {
  userData?: UserData;
}
