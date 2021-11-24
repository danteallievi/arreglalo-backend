import { Schema, model } from "mongoose";

import IProfessional from "../../interfaces/models/professional";

const professionalSchema = new Schema<IProfessional>({
  clients: {
    type: [Schema.Types.ObjectId],
    ref: "Client",
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

const Professional = model("Professional", professionalSchema);

export default Professional;
