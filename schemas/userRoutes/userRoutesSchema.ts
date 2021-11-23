import { Joi } from "express-validation";

const professionalRegisterSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    password: Joi.string().required(),
    DNI: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.object({
      street: Joi.string().required(),
      number: Joi.string().required(),
      zip: Joi.string().required(),
    }).required(),
  }),
};

export default professionalRegisterSchema;
