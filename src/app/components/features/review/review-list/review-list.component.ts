import {Component, Input, OnInit} from '@angular/core';
import {Review} from "../../../../model";

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {

  @Input()
  public reviews!: Review[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
