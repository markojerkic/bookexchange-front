import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Author, Genre} from "../../../../model";
import {isbnValidator} from "../../../../util";

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.scss']
})
export class AdvertComponent implements OnInit {

  public form!: FormGroup;
  public loading: boolean;

  // Dummy data
  public genres: Genre[];
  public autores: Author[];

  constructor(private formBuilder: FormBuilder) {
    this.loading = false;

    this.genres = [
      {label: 'Krimić', value: 'crimi'},
      {label: 'Krimić', value: 'crimi'},
    ];

    this.autores = [
      {
        id: 2,
        firstName: 'Ivo',
        lastName: 'Andrić',
        displayName: 'Andrić, Ivo'
      },
      {
        id: 1,
        firstName: 'Ivo',
        lastName: 'Andrić',
        displayName: 'Andrić, Ivo'
      },
    ]
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      advertTitle: ['', [Validators.required, Validators.maxLength(30)]],
      author: ['', Validators.required],
      bookTitle: ['', [Validators.required, Validators.maxLength(30)]],
      isbn: ['', isbnValidator()],
      genre: ['']
    });
  }

  public submitAdvert(): void {

  }
}
