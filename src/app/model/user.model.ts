import {Review} from "./review.model";

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  userReviews?: Review[];
}
