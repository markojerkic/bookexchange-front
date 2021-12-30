import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject} from "rxjs";
import {Review} from "../../../../model";
import {takeUntil} from "rxjs/operators";

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
  @Input('clearForm')
  public clearInputForm$!: Observable<void>;
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

    this.clearInputForm$.pipe(takeUntil(this.ngDestroy$)).subscribe(() =>
      this.reviewForm.patchValue(({reviewGrade: 0, description: ''})));
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
