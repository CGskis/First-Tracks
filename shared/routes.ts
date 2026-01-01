
import { z } from 'zod';
import { weatherSchema, insertResortSchema, resorts } from './schema';

export const api = {
  weather: {
    get: {
      method: 'GET' as const,
      path: '/api/weather',
      input: z.object({
        lat: z.coerce.number(),
        lon: z.coerce.number(),
      }),
      responses: {
        200: weatherSchema,
        500: z.object({ message: z.string() }),
      },
    },
  },
  resorts: {
    search: {
      method: 'GET' as const,
      path: '/api/resorts/search',
      input: z.object({
        q: z.string(),
      }),
      responses: {
        200: z.array(z.custom<typeof resorts.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
