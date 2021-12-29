import {Component, Input, OnInit} from '@angular/core';
import {Advert} from "../../../../model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-advert-preview',
  templateUrl: './advert-preview.component.html',
  styleUrls: ['./advert-preview.component.scss']
})
export class AdvertPreviewComponent implements OnInit {

  @Input()
  public adverts!: Advert[];

  public gridImageWidth: string;

  constructor(private router: Router) {
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

  public navigateToAdvertDetail(advertId: number): void {
    this.router.navigate([`/advert/${advertId}`]);
  }

  public previewImageUrl(advert: Advert): string {
    return advert.advertImages.length > 0? advert.advertImages[0].imageUrl!: '/assets/no-image-available-2.jpg';
  }
}
