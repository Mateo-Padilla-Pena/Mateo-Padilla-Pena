import Joi from "joi";

export const experienceItemSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  company: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "El nombre de la empresa es obligatorio.",
  }),
  position: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "El cargo es obligatorio.",
  }),
  period: Joi.string().allow("").max(100),
  location: Joi.string().allow("").max(150),
  description: Joi.string().allow("").max(3000),
  achievements: Joi.array().items(Joi.string().trim().allow("")).default([]),
  tech: Joi.array().items(Joi.string().trim()).optional().default([]),
});

export const experiencesSchema = Joi.array().items(experienceItemSchema);

