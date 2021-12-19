import {Component, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthorService, GenreService, NotificationService} from "../../../../services";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {Author, Genre} from "../../../../model";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {GenreComponent} from "../../genre";
import {Router} from '@angular/router';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
  providers: [DialogService]
})
export class AuthorComponent implements OnInit {

  public authorForm!: FormGroup;
  public loading: boolean;

  public genres$!: Observable<Genre[]>;

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService,
              private notificationService: NotificationService,
              @Optional() private dialogRef: DynamicDialogRef,
              private dialogService: DialogService,
              private router: Router) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.authorForm = this.formBuilder.group({
      id: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      yearOfBirth: [null, Validators.required],
      yearOfDeath: [null],
      authorsGenres: [null]
    });

    this.genres$ = this.genreService.getAllGenres();
  }

  public submitAuthor(): void {
    const author: Author = this.authorForm.value;

    this.loading = true;
    this.authorService.saveAuthor(author).pipe(tap((savedAuthor: Author) => {
      this.loading = false;
      this.notificationService.success(`Autor ${savedAuthor.displayName} uspješno spremljen`);
      if (this.dialogRef) {
        this.dialogRef.close(savedAuthor);
      } else {
        this.router.navigate(['']);
      }
    }, () => {
      this.notificationService.error('Greška prilikom spremanja autora');
      this.loading = false;
    })).subscribe();
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
}
