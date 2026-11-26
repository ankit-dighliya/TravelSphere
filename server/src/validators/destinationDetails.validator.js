import { z } from "zod";

// Validate destination details request parameters
export const getDestinationDetailsSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .trim()
      .min(1, "Destination slug is required.")
      .max(120, "Destination slug is too long.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Invalid destination slug format."
      ),
  }),

  query: z.object({}),

  body: z.object({}),
});