import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {Author, Book, Genre} from "../../../../model";
import {AuthorService, BookService, GenreService, NotificationService} from "../../../../services";
import {tap} from "rxjs/operators";
import {DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  public bookForm!: FormGroup;

  public authors$!: Observable<Author[]>;
  public genres$!: Observable<Genre[]>;

  public loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService,
              private bookService: BookService,
              private notificationService: NotificationService,
              private dialogRef: DynamicDialogRef) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      title: [null, Validators.required],
      isbn: [null, Validators.required],
      genres: [null, Validators.required],
      bookAuthor: this.formBuilder.group({
        id: [null, Validators.required]
      })
    });

    this.authors$ = this.authorService.getAllAuthors();
    this.genres$ = this.genreService.getAllGenres();
  }

  public submitBook(): void {
    const book: Book = this.bookForm.value;

    this.loading = true;
    this.bookService.saveBook(book).pipe(tap((savedBook: Book) => {
      this.loading = false;
      this.notificationService.success(`Knjiga ${savedBook.title} uspješno spremljena`);
      this.dialogRef.close(savedBook);
    }, () => {
      this.notificationService.error('Greška prilikom spremanja knjige');
      this.loading = false;
    })).subscribe();
  }

}