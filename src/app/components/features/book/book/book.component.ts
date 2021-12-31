import {Component, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, throwError} from "rxjs";
import {Author, Book, Genre, Image} from "../../../../model";
import {
  AuthorService,
  AuthService,
  BookService,
  GenreService,
  ImageService,
  NotificationService
} from "../../../../services";
import {catchError, finalize, map, takeUntil, tap} from "rxjs/operators";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {AuthorComponent} from "../../author";
import {GenreComponent} from "../../genre";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {FileUpload} from "primeng/fileupload";
import {ImageUtil} from "../../../../util";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [DialogService]
})
export class BookComponent implements OnInit, OnDestroy {

  @ViewChild('fileUpload')
  private fileUpload!: FileUpload;

  public bookForm!: FormGroup;

  public authors$!: Observable<Author[]>;
  public genres$!: Observable<Genre[]>;

  public loading: boolean;
  public imageIsUploading: boolean;
  public id?: number;
  public formImages$!: Observable<Image[]>;
  private onDestroy$: Subject<void>;

  public imageIsDeleting: Map<string, boolean>;

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService,
              private bookService: BookService,
              private notificationService: NotificationService,
              private dialogService: DialogService,
              @Optional() public dialogRef: DynamicDialogRef,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private imageService: ImageService,
              public authService: AuthService) {
    this.loading = false;
    this.imageIsDeleting = new Map<string, boolean>();
    this.onDestroy$ = new Subject();
    this.imageIsUploading = false;
  }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      title: [null, Validators.required],
      isbn: [null, Validators.required],
      genres: [null, Validators.required],
      bookAuthor: this.formBuilder.group({
        id: [null, Validators.required]
      }),
      bookImages: []
    });

    this.setFormImages();

    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id && !this.dialogRef) {
        this.id = id;
        this.setBook(id);
      }
    });

    this.authors$ = this.authorService.getAllAuthors();
    this.genres$ = this.genreService.getAllGenres();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

  private setFormImages(): void {
    this.formImages$ = this.bookForm.valueChanges.pipe(map((value) => value.bookImages as Image[]),
      map((images: Image[]) => (!images) ? [] : images),
      map((bookImages: Image[]) => bookImages.map(ImageUtil.setImageUrl)));
  }

  public submitBook(): void {
    const book: Book = this.bookForm.value;

    this.loading = true;
    this.bookService.saveBook(book, this.id).pipe(
      finalize(() => this.loading = false),
      takeUntil(this.onDestroy$),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.bookForm.controls['isbn'].setErrors({'used': true});
        }
        this.notificationService.error('Greška prilikom spremanja knjige');
        return throwError(() => error);
      }),
      tap((savedBook: Book) => {
        this.notificationService.success(`Knjiga ${savedBook.title} uspješno spremljena`);
        if (this.dialogRef) {
          this.dialogRef.close(savedBook);
        } else {
          this.router.navigate([`/book/${savedBook.id}`]);
        }
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

  private setBook(id: number): void {
    this.loading = true;
    this.bookService.getBookById(id).pipe(
      finalize(() => this.loading = false),
      catchError((error: Error) => {
        this.notificationService.error(`Greška prilikom dohvata knjige ${id}`);
        return throwError(() => error);
      })).subscribe((book: Book) => {
      this.bookForm.patchValue({
        title: book.title,
        isbn: book.isbn,
        genres: book.genres,
        bookAuthor: {
          id: book.bookAuthor.id
        },
        bookImages: book.bookImages
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
        let currentImages: Image[] = this.bookForm.get('bookImages')!.value;
        currentImages = currentImages.filter((image: Image) => image.uuid !== imageUuid);
        this.bookForm.patchValue({bookImages: currentImages});
      });
  }

  public uploadImages(images: File[]): void {
    this.fileUpload.disabled = true;
    this.imageIsUploading = true;
    this.imageService.uploadImages(images).pipe(finalize(() => {
        this.fileUpload.disabled = false;
        this.imageIsUploading = false;
      }),
      takeUntil(this.onDestroy$),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.error('Greška prilikom prijenosa slika');
        return throwError(() => error);
      })).subscribe((images: Image[]) => {
      this.fileUpload.clear();
      let currentImages: Image[] = this.bookForm.get('bookImages')!.value!;
      if (!currentImages) {
        currentImages = [];
      }
      images.map(ImageUtil.setImageUrl).forEach((image: Image) => currentImages.push(image));
      this.bookForm.patchValue({bookImages: currentImages});
    });
  }
}
