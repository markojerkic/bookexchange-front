import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {Review} from "../../../../model";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, OnDestroy {

  @Input()
  public disabled?: boolean;
  @Input()
  public loading?: boolean;
  @Output()
  public onSubmit: EventEmitter<Review>;
  public reviewForm!: FormGroup;
  private ngDestroy$: Subject<void>;

  constructor(private formBuilder: FormBuilder) {
    this.ngDestroy$ = new Subject();
    this.onSubmit = new EventEmitter<Review>();
  }

  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      reviewGrade: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      description: []
    });
  }

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.unsubscribe();
  }

  public submitReview(): void {
    const review: Review = this.reviewForm.value;
    this.onSubmit.next(review);
  }
}
