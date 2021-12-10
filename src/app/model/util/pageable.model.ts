import {Sort} from "./sort.model";

export interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
}
