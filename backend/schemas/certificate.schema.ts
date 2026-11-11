import Joi from "joi";

export const certificateItemSchema = Joi.alternatives().try(
  Joi.string().trim().min(2).max(200),
  Joi.object({
    id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
    name: Joi.string().trim().min(2).max(200).required().messages({
      "string.empty": "El nombre del certificado es obligatorio.",
    }),
    institution: Joi.string().allow("").max(150),
    date: Joi.string().allow("").max(100),
    image: Joi.string().allow("").uri({ allowRelative: true }),
    document: Joi.string().allow("").uri({ allowRelative: true }),
    credentialUrl: Joi.string().allow(""),
  })
);

export const certificatesSchema = Joi.array().items(certificateItemSchema);

