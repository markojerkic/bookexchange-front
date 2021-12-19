import {Component, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthorService, GenreService, NotificationService} from "../../../../services";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {Author, Genre} from "../../../../model";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {

  public authorForm!: FormGroup;
  public loading: boolean;

  public genres$!: Observable<Genre[]>;

  constructor(private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private genreService: GenreService,
              private notificationService: NotificationService,
              @Optional() private dialogRef: DynamicDialogRef) {
    this.loading = false;
  }

  ngOnInit(): void {
    /**
     *   id?: number;
     *   firstName: string;
     *   lastName: string;
     *   yearOfBirth: number;
     *   yearOfDeath?: number;
     *   authorsGenres?: Genre[];
     *   reviews?: Review[];
     *   authorImages?: Image[];
     */
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
      }
    }, () => {
      this.notificationService.error('Greška prilikom spremanja autora');
      this.loading = false;
    })).subscribe();
  }
}
