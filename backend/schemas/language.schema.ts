import Joi from "joi";

export const languageItemSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "El nombre del idioma es obligatorio.",
  }),
  level: Joi.string().allow("").max(100),
  percentage: Joi.number().min(0).max(100).default(50),
});

export const languagesSchema = Joi.array().items(languageItemSchema);

