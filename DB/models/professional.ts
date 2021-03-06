import { Schema, model } from "mongoose";

import IProfessional from "../../interfaces/models/professional";

const professionalSchema = new Schema<IProfessional>({
  clients: {
    type: [Schema.Types.ObjectId],
    ref: "Client",
  },
  avatar: {
    type: String,
    default:
      "https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-user-14.png",
  },
  professional: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
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
  skills: {
    type: [String],
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
