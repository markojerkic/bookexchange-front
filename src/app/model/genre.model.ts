import { z } from "zod";
import { bookValidator } from "./book.model";

export const GenreValidator = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  books: bookValidator.array().optional()
});

export type Genre = z.infer<typeof GenreValidator>;