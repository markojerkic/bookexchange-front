import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Advert, AdvertType, Author, Book, Genre, TransactionType} from "../../../../model";
import {Observable, Subject} from "rxjs";
import {AdvertService, AuthorService, BookService, GenreService, NotificationService} from "../../../../services";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.scss']
})
export class AdvertComponent implements OnInit, OnDestroy {

  private onDestroy$: Subject<void>;

  public form!: FormGroup;
  public loading: boolean;

  public genres!: Observable<Genre[]>;
  public authors!: Observable<Author[]>;
  public books!: Observable<Book[]>;
  public advertTypes: {label: string, value: AdvertType}[];
  public transactionTypes: {label: string, value: TransactionType}[];

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService,
              private bookService: BookService,
              private advertService: AdvertService,
              private notificationService: NotificationService) {
    this.onDestroy$ = new Subject();
    this.loading = false;

    this.advertTypes = [
      {
        label: 'Izdajem', value: AdvertType.ISSUING
      },
      {
        label: 'Tražim', value: AdvertType.LOOKING
      }
    ];
    this.transactionTypes = [
      {
        label: 'Kupovina', value: TransactionType.BUY
      },
      {
        label: 'Posudba', value: TransactionType.LOAN
      }
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      author: this.formBuilder.group({
        id: ['', Validators.required]
      }),
      advertisedBook: this.formBuilder.group({
        id: ['', Validators.required]
      }),
      //isbn: ['', isbnValidator()],
      /*genre: this.formBuilder.group({
        id: ['', Validators.required]
      }),*/
      advertType: ['', Validators.required],
      transactionType: ['', Validators.required],
      price: ['']
    });

    this.authors = this.authorService.getAllAuthors();
    this.genres = this.genreService.getAllGenres();
    this.books = this.bookService.getAllBooks();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

  public submitAdvert(): void {
    const advert: Advert = this.form.value;
    this.loading = true;
    this.advertService.saveAdvert(advert).pipe(takeUntil(this.onDestroy$)).subscribe((savedAdvert: Advert) => {
      this.loading = false;
      console.log(savedAdvert);
      this.notificationService.success('Uspješno dodan osglas');
    }, () => {
      this.loading = false;
      this.notificationService.error('Greška prilikom dodavanja oglasa');
    });
  }
}
