import {Component, Input, OnInit} from '@angular/core';
import {Advert} from "../../../../model";

@Component({
  selector: 'app-advert-preview',
  templateUrl: './advert-preview.component.html',
  styleUrls: ['./advert-preview.component.scss']
})
export class AdvertPreviewComponent implements OnInit {

  @Input()
  public advert!: Advert;

  constructor() { }

  ngOnInit(): void {
  }

}
