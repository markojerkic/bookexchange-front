import {User} from "./user.model";

export interface Review {
  id?: number;
  reviewGrade: number;
  description?: string;
  userCreated: User;
  lastModified: Date;
}
