import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Advert, AdvertType, Author, Book, Genre, Page, TransactionType} from "../../../../model";
import {AdvertService, AuthorService, BookService, GenreService, NotificationService} from "../../../../services";
import {map, tap} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-advert-list',
  templateUrl: './advert-list.component.html',
  styleUrls: ['./advert-list.component.scss']
})
export class AdvertListComponent implements OnInit {

  public adverts$!: Observable<Advert[]>;
  public currentPage: number;
  public advertLoading: boolean;
  public totalAdverts: number;

  public queryForm!: FormGroup;
  public authors$!: Observable<Author[]>;
  public books$!: Observable<Book[]>;
  public genres$!: Observable<Genre[]>;
  public advertTypes: {label: string, value: AdvertType}[];
  public transactionTypes: {label: string, value: TransactionType}[];


  constructor(private advertService: AdvertService,
              private notificationService: NotificationService,
              private authorService: AuthorService,
              private formBuilder: FormBuilder,
              private bookService: BookService,
              private genreService: GenreService) {
    this.currentPage = 0;
    this.advertLoading = true;
    this.totalAdverts = 0;

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
    this.queryForm = this.formBuilder.group({
      author: this.formBuilder.group({
        id: ['']
      }),
      book: this.formBuilder.group({
        id: ['']
      }),
      genre: this.formBuilder.group({
        id: ['']
      }),
      advertType: [''],
      transactionType: [''],
      fromPrice: [],
      toPrice: [],
      isbn: [''],
      query: ['']
    });

    this.authors$ = this.authorService.getAllAuthors().pipe(map((authors: Author[]) => {
      return authors.map((author: Author) => {
        author.displayName = `${author.firstName} ${author.lastName}`;
        return author;
      })
    }));
    this.books$ = this.bookService.getAllBooks();
    this.genres$ = this.genreService.getAllGenres();

    this.loadAdvertPage({page: this.currentPage, rows: 10});
  }

  public loadAdvertPage(pageRequest: {page: number, rows: number}): void {
    this.adverts$ = this.advertService.getAdvertPage(pageRequest.page).pipe(
      tap((page: Page<Advert>) => {
        this.advertLoading = false;
        this.currentPage = page.pageable.pageNumber;
        this.totalAdverts = page.totalElements;
      }, () => {
        this.currentPage = 0;
        this.totalAdverts = 0;
        this.advertLoading = false;
        this.notificationService.error('Došlo je do greške prilikom dohvata pitanja');
      }),
      map((page: Page<Advert>) => page.content)
    );

  }

  public submitQuery(): void {
    console.log(this.queryForm.value);
  }
}
