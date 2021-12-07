import {AdvertType} from "./enum";
import {TransactionType} from "./enum";
import {AdvertStatus} from "./enum";
import {User} from "./user.model";
import {Book} from "./book.model";
import {Image} from "./image.model";

export interface Advert {
  id?: number;
  title: string;
  description?: string;
  lastModified: Date;
  price?: number;
  advertType: AdvertType;
  transactionType: TransactionType;
  advertStatus: AdvertStatus;
  userCreated?: User;
  advertisedBook?: Book;
  advertImages?: Image[];
}
