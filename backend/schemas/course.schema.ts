import Joi from "joi";

export const courseItemSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  name: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "El nombre del curso es obligatorio.",
  }),
  institution: Joi.string().trim().allow("").max(150),
  date: Joi.string().allow("").max(100),
});

export const coursesSchema = Joi.array().items(courseItemSchema);

