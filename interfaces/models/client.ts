import { ObjectId } from "mongoose";
import IAddress from "./address";

export default interface IClient {
  name: string;
  surname: string;
  DNI: string;
  dateOfBirth: string;
  professionals: ObjectId[];
  email: string;
  password: string;
  phone: string;
  address: IAddress;
}
