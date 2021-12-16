import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Advert, AdvertType, Author, Book, Genre, TransactionType} from "../../../../model";
import {Observable, Subject} from "rxjs";
import {AdvertService, AuthorService, BookService, GenreService, NotificationService} from "../../../../services";
import {takeUntil, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {DialogService} from "primeng/dynamicdialog";
import {BookComponent} from "../../book";

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.scss'],
  providers: [DialogService]
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
              private notificationService: NotificationService,
              private router: Router,
              private dialogService: DialogService) {
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
      title: [null, [Validators.required, Validators.maxLength(50)]],
      description: [null, [Validators.required, Validators.maxLength(200)]],
      advertisedBook: this.formBuilder.group({
        id: [null, Validators.required]
      }),
      advertType: [null, Validators.required],
      transactionType: [null, Validators.required],
      price: [null]
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
      this.router.navigate(['/adverts']);
      this.notificationService.success('Uspješno dodan osglas');
    }, () => {
      this.loading = false;
      this.notificationService.error('Greška prilikom dodavanja oglasa');
    });
  }

  public openNewBookDialog(): void {
    const ref = this.dialogService.open(BookComponent, {
      header: 'Unos nove knjige',
      width: '70%'
    });

    ref.onClose.subscribe((savedBook: Book) => {
      this.books = this.bookService.getAllBooks().pipe(tap(() => {
        this.form.patchValue({advertisedBook: {id: savedBook.id}});
      }));
    });
  }

}
