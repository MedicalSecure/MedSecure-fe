import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  providers: [],
  imports: [
    RouterModule,

  ],
})
export class NavbarComponent {
  constructor(private router: Router) {}

  notification = {
    title:"",
    type:"",
    content:"",
    
  }
}
export type notification<T>={
  title:string,
  type:string,
  content:string,
  route:string|null,
  data:T
}
