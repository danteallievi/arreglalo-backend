import { Schema, Types, model } from "mongoose";

import IClient from "../../interfaces/models/client";

const clientSchema = new Schema<IClient>({
  professionals: {
    type: [Types.ObjectId],
    ref: "Professional",
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  DNI: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
});

const User = model("Client", clientSchema, "Clients");

export default User;
