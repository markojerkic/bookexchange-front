import {Page} from "./page.model";
import {Review} from "../review.model";

export interface ReviewPage {
  reviews: Page<Review>;
  averageReviewGrade: number;
}
