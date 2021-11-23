interface IAddress {
  city: string;
  street: string;
  zip: string;
}

export default interface IClient {
  name: string;
  surname: string;
  DNI: string;
  dateOfBirth: string;
  professionals: string[];
  email: string;
  password: string;
  phone: string;
  address: IAddress;
}
