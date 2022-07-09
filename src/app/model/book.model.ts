import {Review} from "./review.model";
import {Genre, genreValidator} from "./genre.model";
import {Image, imageValidator} from "./image.model";
import {Author, authorValidator} from "./author.model";
import { z } from "zod";

interface Book {
  id?: number;
  title: string;
  isbn: string;
  reviews: Review[];
  genres: Genre[];
  bookImages: Image[];
  bookAuthor: Author;

  displayName?: string;
}

const bookValidator = z.object({
  id: z.number().optional(),
  title: z.string(),
  isbn: z.string(),
  genres: genreValidator.array(),
  bookAuthor: authorValidator,
  bookImages: imageValidator.array(),
  displayName: z.string().optional(),
});

export { Book, bookValidator }
