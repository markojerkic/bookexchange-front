import {Review} from "./review.model";
import {Genre} from "./genre.model";
import {Image} from "./image.model";

export interface Book {
  id?: number;
  title: string;
  ISBN: string;
  reviews?: Review[];
  genres?: Genre[];
  bookImages?: Image[];
}
