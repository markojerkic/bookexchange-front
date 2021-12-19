import { Component, OnInit, Optional } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {Author, Book, Genre} from "../../../../model";
import {AuthorService, BookService, GenreService, NotificationService} from "../../../../services";
import {tap} from "rxjs/operators";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {AuthorComponent} from "../../author";
import {GenreComponent} from "../../genre";
import {Router} from "@angular/router";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [DialogService]
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
              private dialogService: DialogService,
              @Optional() private dialogRef: DynamicDialogRef,
              private router: Router) {
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
      if (this.dialogRef) {
        this.dialogRef.close(savedBook);
      } else {
        this.router.navigate(['']);
      }
    }, () => {
      this.notificationService.error('Greška prilikom spremanja knjige');
      this.loading = false;
    })).subscribe();
  }

  public openNewAuthorDialog(): void {
    const ref = this.dialogService.open(AuthorComponent, {
      header: 'Unos novog autora',
      width: '70%'
    });

    ref.onClose.subscribe((savedAuthor: Author) => {
      if (!savedAuthor) {
        return;
      }
      this.authors$ = this.authorService.getAllAuthors().pipe(tap(() => {
        this.bookForm.patchValue({bookAuthor: {id: savedAuthor.id}});
      }));
    });
  }

  public openNewGenreDialog(): void {
    const ref = this.dialogService.open(GenreComponent, {
      header: 'Unos novog žanra',
      width: '70%'
    });

    ref.onClose.subscribe((savedGenre: Genre) => {
      if (!savedGenre) {
        return;
      }
      this.genres$ = this.genreService.getAllGenres().pipe(tap(() => {
        this.bookForm.patchValue({genres: [{id: savedGenre.id}]});
      }));
    });

  }
}
