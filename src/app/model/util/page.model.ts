import {Pageable} from "./pageable.model";
import {Sort} from "./sort.model";

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
