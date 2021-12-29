import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Advert, AdvertType, Author, Book, Genre, Image, TransactionType} from "../../../../model";
import {Observable, Subject, throwError} from "rxjs";
import {
  AdvertService,
  AuthorService,
  BookService,
  GenreService,
  ImageService,
  NotificationService
} from "../../../../services";
import {catchError, finalize, map, takeUntil, tap} from "rxjs/operators";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {DialogService} from "primeng/dynamicdialog";
import {BookComponent} from "../../book";
import {HttpErrorResponse} from "@angular/common/http";
import {FileUpload} from "primeng/fileupload";
import {ImageUtil} from "../../../../util";

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.scss'],
  providers: [DialogService]
})
export class AdvertComponent implements OnInit, OnDestroy {

  @ViewChild('fileUpload')
  private fileUpload!: FileUpload;

  public form!: FormGroup;
  public loading: boolean;
  public genres!: Observable<Genre[]>;
  public authors!: Observable<Author[]>;
  public books!: Observable<Book[]>;
  public advertTypes: { label: string, value: AdvertType }[];
  public transactionTypes: { label: string, value: TransactionType }[];
  private onDestroy$: Subject<void>;
  public id?: number;
  public formImages$!: Observable<Image[]>;

  public imageIsDeleting: Map<string, boolean>;

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService,
              private bookService: BookService,
              private advertService: AdvertService,
              private notificationService: NotificationService,
              private router: Router,
              private dialogService: DialogService,
              private imageService: ImageService,
              private activatedRoute: ActivatedRoute) {
    this.onDestroy$ = new Subject();
    this.loading = false;
    this.imageIsDeleting = new Map();

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
        label: 'Kupovina/Prodaja', value: TransactionType.BUY
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
      price: [null],
      advertImages: []
    });

    this.setFormImages();

    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id) {
        this.id = id;
        this.setAdvert(id);
      }
    });

    this.authors = this.authorService.getAllAuthors();
    this.genres = this.genreService.getAllGenres();
    this.books = this.bookService.getAllBooks();
  }

  private setFormImages(): void {
    this.formImages$ = this.form.valueChanges.pipe(map((value) => value.advertImages as Image[]),
      map((advertImages: Image[]) => advertImages.map(ImageUtil.setImageUrl)));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

  public submitAdvert(): void {
    const advert: Advert = this.form.value;
    this.loading = true;
    this.advertService.saveAdvert(advert, this.id).pipe(
      finalize(() => this.loading = false),
      catchError((error: Error) => {
        this.notificationService.error('Greška prilikom spremanja oglasa');
        return throwError(() => error);
      }),
      takeUntil(this.onDestroy$)).subscribe((savedAdvert: Advert) => {
      this.router.navigate([`/advert/${savedAdvert.id}`]);
      this.notificationService.success('Uspješno spremljen oglas');
    });
  }

  public openNewBookDialog(): void {
    const ref = this.dialogService.open(BookComponent, {
      header: 'Unos nove knjige',
      width: '70%'
    });

    ref.onClose.pipe(takeUntil(this.onDestroy$)).subscribe((savedBook: Book) => {
      if (!savedBook) {
        return;
      }
      this.books = this.bookService.getAllBooks().pipe(tap(() => {
        this.form.patchValue({advertisedBook: {id: savedBook.id}});
      }));
    });
  }

  public uploadImages(images: File[]): void {
    this.fileUpload.uploading = true;
    this.imageService.uploadImages(images).pipe(finalize(() => this.fileUpload.uploading = false),
      takeUntil(this.onDestroy$),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.error('Greška prilikom prijenosa slika');
        return throwError(() => error);
      })).subscribe((images: Image[]) => {
      this.fileUpload.clear();
      const currentImages: Image[] = this.form.get('advertImages')!.value;
      images.map(ImageUtil.setImageUrl).forEach((image: Image) => currentImages.push(image));
      this.form.patchValue({advertImages: currentImages});
    });
  }

  private setAdvert(advertId: number): void {
    this.loading = true;
    this.advertService.getAdvertById(advertId).pipe(
      finalize(() => this.loading = false),
      catchError((error: Error) => {
        this.notificationService.error(`Greška prilikom dohvata oglasa ${advertId}`);
        return throwError(() => error);
      })).subscribe((advert: Advert) => {
      this.form.patchValue({
        title: advert.title,
        description: advert.description,
        advertisedBook: advert.advertisedBook,
        advertType: advert.advertType,
        transactionType: advert.transactionType,
        price: advert.price,
        advertImages: advert.advertImages
      });
    });

  }

  public removeImage(imageUuid: string): void {
    this.imageIsDeleting.set(imageUuid, true);
    this.imageService.deleteImage(imageUuid).pipe(finalize(() => this.imageIsDeleting.set(imageUuid, false)),
      catchError((error: Error) => {
        this.notificationService.error(`Greška prilikom birsanja slike ${imageUuid}`);
        return throwError(() => error);
      }))
      .subscribe(() => {
        let currentImages: Image[] = this.form.get('advertImages')!.value;
        currentImages = currentImages.filter((image: Image) => image.uuid !== imageUuid);
        this.form.patchValue({advertImages: currentImages});
      });
  }
}
