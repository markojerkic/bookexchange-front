import {Component, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthorService, AuthService, GenreService, ImageService, NotificationService} from "../../../../services";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {Author, Genre, Image} from "../../../../model";
import {catchError, finalize, map, takeUntil, tap} from "rxjs/operators";
import {Observable, Subject, throwError} from "rxjs";
import {GenreComponent} from "../../genre";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";
import {ImageUtil} from "../../../../util";
import {FileUpload} from "primeng/fileupload";

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
  providers: [DialogService]
})
export class AuthorComponent implements OnInit, OnDestroy {

  public formImages$!: Observable<Image[]>;

  public authorForm!: FormGroup;
  public loading: boolean;

  public id?: number;
  public imageIsDeleting: Map<string, boolean>;
  public imageIsUploading: boolean;
  @ViewChild('fileUpload')
  private fileUpload!: FileUpload;
  private onDestroy$: Subject<void>;

  public genres$!: Observable<Genre[]>;

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService,
              private notificationService: NotificationService,
              @Optional() public dialogRef: DynamicDialogRef,
              private dialogService: DialogService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private imageService: ImageService,
              public authService: AuthService) {
    this.loading = false;
    this.onDestroy$ = new Subject<void>();
    this.imageIsDeleting = new Map<string, boolean>();
    this.imageIsUploading = false;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.authorForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      yearOfBirth: [null, Validators.required],
      yearOfDeath: [null],
      authorsGenres: [null],
      authorImages: []
    });

    this.setFormImages();

    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id && !this.dialogRef) {
        this.id = id;
        this.setAuthor(id);
      }
    });

    this.genres$ = this.genreService.getAllGenres();
  }

  public submitAuthor(): void {
    const author: Author = this.authorForm.value;

    this.loading = true;
    this.authorService.saveAuthor(author, this.id).pipe(tap((savedAuthor: Author) => {
      this.notificationService.success(`Autor ${savedAuthor.displayName} uspješno spremljen`);
      if (this.dialogRef) {
        this.dialogRef.close(savedAuthor);
      } else {
        this.router.navigate([`/author/${savedAuthor.id}`]);
      }
    }, () => {
      this.notificationService.error('Greška prilikom spremanja autora');
    }), finalize(() => this.loading = false)).subscribe();
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
        this.authorForm.patchValue({authorsGenres: [{id: savedGenre.id}]});
      }));
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
        let currentImages: Image[] = this.authorForm.get('authorImages')!.value;
        currentImages = currentImages.filter((image: Image) => image.uuid !== imageUuid);
        this.authorForm.patchValue({authorImages: currentImages});
      });
  }

  public uploadImages(images: File[]): void {
    this.fileUpload.disabled = true;
    this.imageIsUploading = true;
    this.imageService.uploadImages(images).pipe(
      finalize(() => {
        this.fileUpload.disabled = false;
        this.imageIsUploading = false;
      }),
      takeUntil(this.onDestroy$),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.error('Greška prilikom prijenosa slika');
        return throwError(() => error);
      })).subscribe((images: Image[]) => {
      this.fileUpload.clear();
      let currentImages: Image[] = this.authorForm.get('authorImages')!.value!;
      if (!currentImages) {
        currentImages = [];
      }
      images.map(ImageUtil.setImageUrl).forEach((image: Image) => currentImages.push(image));
      this.authorForm.patchValue({authorImages: currentImages});
    });
  }

  private setAuthor(id: number) {
    this.loading = true;
    this.authorService.getAuthorById(id).pipe(finalize(() => this.loading = false)).subscribe((author: Author) => {
      this.authorForm.patchValue({
        firstName: author.firstName,
        lastName: author.lastName,
        yearOfBirth: author.yearOfBirth,
        yearOfDeath: author.yearOfDeath,
        authorsGenres: author.authorsGenres,
        authorImages: author.authorImages
      });
    }, () => {
      this.notificationService.error(`Greška prilikom dohvata autora ${id}`);
    });
  }

  private setFormImages(): void {
    this.formImages$ = this.authorForm.valueChanges.pipe(map((value) => value.authorImages as Image[]),
      map((images: Image[]) => (!images) ? [] : images),
      map((authorImages: Image[]) => authorImages.map(ImageUtil.setImageUrl)));
  }
}
