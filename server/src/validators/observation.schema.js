// src/modules/observations/observation.schema.js
import { z } from 'zod';

const numericField = (label, min, max) =>
  z
    .number({ required_error: `${label} is required`, invalid_type_error: `${label} must be a number` })
    .finite(`${label} must be a finite number`)
    .min(min, `${label} minimum is ${min}`)
    .max(max, `${label} maximum is ${max}`);

const observationFields = {
  altitude: numericField('Altitude', 0, 50000),
  temperature: numericField('Temperature', -100, 60),
  pressure: numericField('Pressure', 1, 1100),
  humidity: numericField('Humidity', 0, 100),
  windSpeed: numericField('Wind speed', 0, 200),
  windDirection: numericField('Wind direction', 0, 360),
  recordedAt: z.coerce
    .date({ invalid_type_error: 'recordedAt must be a valid date' })
    .refine((d) => !isNaN(d.getTime()), { message: 'Invalid date' }),
  source: z.enum(['simulated', 'instrument', 'manual']),
};

export const createObservationSchema = z.object(observationFields);

export const updateObservationSchema = z
  .object(
    Object.fromEntries(
      Object.entries(observationFields).map(([k, v]) => [k, v.optional()])
    )
  )
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const observationIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid observation ID'),
});

// Base object schema kept separate so .omit() can be called before refinements.
// Calling .refine() returns ZodEffects which has no .omit() method.
const listObservationsBaseSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAltitude: z.coerce.number().min(0).max(50000).optional(),
  maxAltitude: z.coerce.number().min(0).max(50000).optional(),
  source: z.enum(['simulated', 'instrument', 'manual']).optional(),
  sortBy: z.enum(['recordedAt', 'altitude', 'temperature', 'pressure']).default('recordedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const dateRangeRefinement = (data) =>
  !data.startDate || !data.endDate || data.startDate <= data.endDate;

const altitudeRangeRefinement = (data) =>
  data.minAltitude === undefined ||
  data.maxAltitude === undefined ||
  data.minAltitude <= data.maxAltitude;

export const listObservationsQuerySchema = listObservationsBaseSchema
  .refine(dateRangeRefinement, {
    message: 'startDate must be before or equal to endDate',
    path: ['startDate'],
  })
  .refine(altitudeRangeRefinement, {
    message: 'minAltitude must be less than or equal to maxAltitude',
    path: ['minAltitude'],
  });

// Export schema: same filters but no pagination or sort controls.
// Max 10,000 records enforced in the service layer.
const exportBaseSchema = listObservationsBaseSchema.omit({
  page: true,
  limit: true,
  sortBy: true,
  sortOrder: true,
}).extend({
  format: z.enum(['csv', 'excel', 'xlsx']).optional(),
});


export const exportObservationsQuerySchema = exportBaseSchema
  .refine(dateRangeRefinement, {
    message: 'startDate must be before or equal to endDate',
    path: ['startDate'],
  })
  .refine(altitudeRangeRefinement, {
    message: 'minAltitude must be less than or equal to maxAltitude',
    path: ['minAltitude'],
  });



