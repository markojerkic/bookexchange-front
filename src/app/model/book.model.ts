import {Review} from "./review.model";
import {Genre} from "./genre.model";
import {Image} from "./image.model";
import {Author} from "./author.model";

export interface Book {
  id?: number;
  title: string;
  isbn: string;
  reviews?: Review[];
  genres?: Genre[];
  bookImages?: Image[];
  bookAuthor?: Author
}
