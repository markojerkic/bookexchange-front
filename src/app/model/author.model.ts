import {Genre} from "./genre.model";

export interface Author {
  id?: number;
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  yearOfDeath?: number;
  authorsGenres?: Genre[];

  displayName?: string;
}
