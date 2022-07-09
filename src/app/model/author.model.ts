import {Genre, genreValidator} from "./genre.model";
import {Review} from "./review.model";
import {Image} from "./image.model";
import { z } from "zod";

interface Author {
  id?: number;
  firstName: string;
  lastName: string;
  yearOfBirth: Date;
  yearOfDeath?: Date;
  authorsGenres: Genre[];
  reviews: Review[];
  authorImages: Image[];

  displayName: string;
}

const authorValidator = z.object({
  id: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  yearOfBirth: z.date(),
  yearOfDeath: z.date().optional(),
  authorsGenres: genreValidator.array(),
});

export {  Author, authorValidator };