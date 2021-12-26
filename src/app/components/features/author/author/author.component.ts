import {Component, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthorService, GenreService, NotificationService} from "../../../../services";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {Author, Genre} from "../../../../model";
import {finalize, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {GenreComponent} from "../../genre";
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
  providers: [DialogService]
})
export class AuthorComponent implements OnInit {

  public authorForm!: FormGroup;
  public loading: boolean;

  public id?: number;

  public genres$!: Observable<Genre[]>;

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService,
              private notificationService: NotificationService,
              @Optional() private dialogRef: DynamicDialogRef,
              private dialogService: DialogService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.authorForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      yearOfBirth: [null, Validators.required],
      yearOfDeath: [null],
      authorsGenres: [null]
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id) {
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

  private setAuthor(id: number) {
    this.loading = true;
    this.authorService.getAuthorById(id).pipe(finalize(() => this.loading = false)).subscribe((author: Author) => {
      this.authorForm.patchValue({
        firstName: author.firstName,
        lastName: author.lastName,
        yearOfBirth: author.yearOfBirth,
        yearOfDeath: author.yearOfDeath,
        authorsGenres: author.authorsGenres
      });
    }, () => {
      this.notificationService.error(`Greška prilikom dohvata autora ${id}`);
    })

  }
}
