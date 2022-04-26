import { Joi } from "express-validation";

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

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
      city: Joi.string().required(),
      zip: Joi.string().required(),
    }).required(),
    avatar: Joi.string().optional(),
    skills: Joi.optional(),
  }),
};

const clientRegisterSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    avatar: Joi.string().optional(),
    surname: Joi.string().required(),
    password: Joi.string().required(),
    DNI: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      zip: Joi.string().required(),
    }).required(),
  }),
};

export { professionalRegisterSchema, clientRegisterSchema, loginSchema };
