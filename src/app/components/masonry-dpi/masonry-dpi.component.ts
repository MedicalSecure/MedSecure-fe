import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxMasonryModule } from 'ngx-masonry';
import { MatCardModule } from '@angular/material/card';
import { NgxMasonryOptions } from 'ngx-masonry';
import { RouterModule } from '@angular/router';


interface MasonryItem {
  title: string;
  description : string;
}

@Component({
  selector: 'app-masonry-dpi',
  standalone: true,
  imports: [CommonModule,NgxMasonryModule,MatCardModule,RouterModule],
  templateUrl: './masonry-dpi.component.html',
  styleUrl: './masonry-dpi.component.css'
})
export class MasonryDpiComponent {
   // ngx-masonry options
   public masonryOptions: NgxMasonryOptions = {
    gutter: 10,
    fitWidth: true,
    horizontalOrder: true
  };

  // sample data for cards
  public cards = [
    { title: 'General informations', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.' },
    { title: 'Allergies', content: 'Vestibulum quis leo id magna ullamcorper venenatis. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
    { title: '', content: 'Donec interdum lectus mauris, nec pharetra sapien imperdiet sed. Phasellus vitae felis sit amet leo placerat imperdiet id quis magna.' },
    { title: '', content: 'Sed quis nisi sed neque tincidunt maximus. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
    { title: '', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum lectus mauris, nec pharetra sapien imperdiet sed.' }
  ];}

