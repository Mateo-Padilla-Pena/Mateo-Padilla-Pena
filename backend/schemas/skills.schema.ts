import Joi from "joi";

const singleSkillSchema = Joi.alternatives().try(
  Joi.string().trim().min(1).max(100),
  Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    logo: Joi.string().allow("").max(100).default("code"),
    level: Joi.string().allow("").max(50),
  })
);

export const skillsSchema = Joi.object({
  backend: Joi.array().items(singleSkillSchema).default([]),
  frontend: Joi.array().items(singleSkillSchema).default([]),
  database: Joi.array().items(singleSkillSchema).default([]),
  cloud: Joi.array().items(singleSkillSchema).default([]),
});

