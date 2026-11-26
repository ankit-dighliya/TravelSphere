import { z } from "zod";

// Validate destination query parameters
export const getDestinationsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(10),

    search: z.string().trim().optional(),

    country: z.string().trim().optional(),

    state: z.string().trim().optional(),

    category: z.string().trim().optional(),

    sort: z
      .enum(["newest", "oldest", "rating", "name"])
      .default("newest"),
  }),

  params: z.object({}),

  body: z.object({}),
});