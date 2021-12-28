import {Component, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {Author, Genre} from "../../../../model";
import {AuthorService, BookService, GenreService, NotificationService} from "../../../../services";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {finalize, tap} from "rxjs/operators";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
  providers: [DialogService]
})
export class GenreComponent implements OnInit {

  public genreForm!: FormGroup;

  public authors$!: Observable<Author[]>;
  public genres$!: Observable<Genre[]>;

  public loading: boolean;

  public id?: number;

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService,
              private bookService: BookService,
              private notificationService: NotificationService,
              private dialogService: DialogService,
              @Optional() private dialogRef: DynamicDialogRef,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.genreForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null]
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id && !this.dialogRef) {
        this.id = id;
        this.setGenre(id);
      }
    });
  }

  public submitGenre(): void {
    const genre: Genre = this.genreForm.value;

    this.loading = true;
    this.genreService.saveGenre(genre, this.id).pipe(
      finalize(() => this.loading = false),
      tap((savedGenre: Genre) => {
        this.notificationService.success(`Žanr ${savedGenre.name} uspješno spremljen`);
        if (this.dialogRef) {
          this.dialogRef.close(savedGenre);
        } else {
          this.router.navigate([`/genre/${savedGenre.id}`]);
        }
      }, () => {
        this.notificationService.error('Greška prilikom spremanja žanra');
      })).subscribe();

  }

  private setGenre(id: number) {
    this.loading = true;
    this.genreService.getGenreById(id).pipe(finalize(() => this.loading = false)).subscribe((genre: Genre) => {
      this.genreForm.patchValue({
        name: genre.name,
        description: genre.description
      });
    }, () => {
      this.notificationService.error(`Greška prilikom dohvata žanra ${id}`);
    });
  }
}
