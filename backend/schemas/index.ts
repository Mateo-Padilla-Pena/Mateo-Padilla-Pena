import { Schema } from "joi";
export * from "./project.schema";
export * from "./personalData.schema";
export * from "./experience.schema";
export * from "./skills.schema";
export * from "./certificate.schema";
export * from "./course.schema";
export * from "./language.schema";

export interface ValidationResult<T> {
  isValid: boolean;
  value?: T;
  error?: string;
  details?: string[];
}

/**
 * Validador genérico que aplica un esquema Joi y retorna un resultado amigable
 */
export function validateWithSchema<T>(schema: Schema, data: unknown): ValidationResult<T> {
  const { value, error } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((d) => d.message);
    return {
      isValid: false,
      error: details.join(" | "),
      details,
    };
  }

  return {
    isValid: true,
    value: value as T,
  };
}

