import { ObjectId } from "mongoose";
import IAddress from "./address";

export default interface IProfessional {
  name: string;
  professional: boolean;
  rate: number;
  surname: string;
  email: string;
  password: string;
  DNI: string;
  dateOfBirth: string;
  clients: ObjectId[];
  phone: string;
  address: IAddress;
  skills: string[];
}
