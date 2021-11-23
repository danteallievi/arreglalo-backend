import IAddress from "./address";

export default interface IProfessional {
  name: string;
  surname: string;
  email: string;
  password: string;
  DNI: string;
  dateOfBirth: string;
  clients: string[];
  phone: string;
  address: IAddress;
  skills: string[];
}
