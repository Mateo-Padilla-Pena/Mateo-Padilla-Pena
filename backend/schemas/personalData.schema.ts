import Joi from "joi";

export const personalDataSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "El nombre completo es requerido.",
  }),
  role: Joi.string().trim().max(150).allow(""),
  bio: Joi.string().allow("").max(20000),
  story: Joi.string().allow("").max(50000),
  profilePhoto: Joi.string().allow("").uri({ allowRelative: true }),
  email: Joi.string().trim().email({ tlds: { allow: false } }).allow("").messages({
    "string.email": "Debe ser un correo electrónico válido.",
  }),
  location: Joi.string().allow("").max(150),
  phone: Joi.string().allow("").max(50),
  linkedin: Joi.string().allow(""),
  github: Joi.string().allow(""),
  available: Joi.boolean().default(true),
});

