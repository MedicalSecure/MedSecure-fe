import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxMasonryModule } from 'ngx-masonry';
import { MatCardModule } from '@angular/material/card';
import { NgxMasonryOptions } from 'ngx-masonry';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RegistrationService } from '../../../services/registration/registration.service';
import { RegisterDto } from '../../../model/Registration';
import { MatTableDataSource } from '@angular/material/table';

interface MasonryItem {
  title: string;
  content: string;
}

export let ELEMENT_DATA: RegisterDto[] = [];
@Component({
  selector: 'app-register-details',
  standalone: true,
  imports: [CommonModule, NgxMasonryModule, MatCardModule, RouterModule],
  templateUrl: './register-details.component.html',
  styleUrl: './register-details.component.css',
})
export class MasonryDpiComponent {
  public masonryOptions: NgxMasonryOptions = {
    gutter: 10,
    fitWidth: true,
    horizontalOrder: true,
  };
  cards=_cards;

  // sample data for cards
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: RegistrationService
  ) {}

  ngOnInit() {}

  
}
const _cards = [
  { title: 'General informations', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.' },
  { title: 'Allergies', content: 'Vestibulum quis leo id magna ullamcorper venenatis. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
  { title: '', content: 'Donec interdum lectus mauris, nec pharetra sapien imperdiet sed. Phasellus vitae felis sit amet leo placerat imperdiet id quis magna.' },
  { title: '', content: 'Sed quis nisi sed neque tincidunt maximus. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
  { title: '', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum lectus mauris, nec pharetra sapien imperdiet sed.' }
];
