import {Component, Input, OnInit} from '@angular/core';
import {Advert} from "../../../../model";

@Component({
  selector: 'app-advert-preview',
  templateUrl: './advert-preview.component.html',
  styleUrls: ['./advert-preview.component.scss']
})
export class AdvertPreviewComponent implements OnInit {

  @Input()
  public adverts!: Advert[];

  public gridImageWidth: string;

  constructor() {
    if (window.screen.width <= 563) {
      this.gridImageWidth = '150';
    } else if (window.screen.width <= 800) {
      this.gridImageWidth = `${window.screen.width / 2}`;
    } else {
      this.gridImageWidth = '450';
    }
  }

  ngOnInit(): void {
  }

}
