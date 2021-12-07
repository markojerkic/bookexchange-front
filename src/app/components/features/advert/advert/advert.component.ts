import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Author, Genre} from "../../../../model";
import {isbnValidator} from "../../../../util";
import {Observable} from "rxjs";
import {AuthorService, GenreService} from "../../../../services";

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.scss']
})
export class AdvertComponent implements OnInit {

  public form!: FormGroup;
  public loading: boolean;

  // Dummy data
  public genres!: Observable<Genre[]>;
  public authors!: Observable<Author[]>;

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      advertTitle: ['', [Validators.required, Validators.maxLength(30)]],
      author: ['', Validators.required],
      bookTitle: ['', [Validators.required, Validators.maxLength(30)]],
      isbn: ['', isbnValidator()],
      genre: ['']
    });

    this.authors = this.authorService.getAllAuthors();
    this.genres = this.genreService.getAllGenres();
  }

  public submitAdvert(): void {

  }
}
