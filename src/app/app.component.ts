import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'book-exchange-front';
  public menuItems!: MenuItem[];
  public authModelItems!: MenuItem[];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.menuItems= [
      {
        label: 'Oglasi',
        icon:'pi pi-fw pi-file'
      }
    ];
    this.authModelItems = [
      {
        label: 'Registriraj se',
        icon: 'pi pi-user-plus',
        command: () => {this.router.navigate(['/register'])}
      }
    ]

  }
}
