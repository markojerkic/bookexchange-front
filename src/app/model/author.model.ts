import {Genre} from "./genre.model";
import {Review} from "./review.model";
import {Image} from "./image.model";

export interface Author {
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
