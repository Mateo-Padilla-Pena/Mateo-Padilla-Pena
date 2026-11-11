import Joi from "joi";

export const projectItemSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  title: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "El título del proyecto es obligatorio.",
    "string.min": "El título debe tener al menos 2 caracteres.",
  }),
  description: Joi.string().allow("").max(2000),
  sector: Joi.string().allow("").max(100),
  tech: Joi.array().items(Joi.string().trim()).default([]),
  image: Joi.string().allow("").uri({ allowRelative: true }).messages({
    "string.uri": "La imagen debe ser una URL válida o ruta relativa.",
  }),
  demo: Joi.string().allow(""),
  code: Joi.string().allow(""),
  impact: Joi.string().allow("").max(500),
});

export const projectsSchema = Joi.array().items(projectItemSchema);

