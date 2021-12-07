import {Author} from "./author.model";
import {Book} from "./book.model";

export interface Genre {
  id?: number;
  name: string;
  description?: string;
  authors?: Author[];
  books?: Book[];
}
