import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxMasonryModule } from 'ngx-masonry';

interface MasonryItem {
  title: string;
  description : string;
  height : number;
  width : number;
}

@Component({
  selector: 'app-masonry',
  standalone: true,
  imports: [NgxMasonryModule, CommonModule],
  templateUrl: './masonry.component.html',
  styleUrl: './masonry.component.css'
})

export class MasonryComponent implements OnInit {
  masonryItems: MasonryItem[] = [];

  ngOnInit() {
    // Load items when the component is initialized
    this.loadItems();
  }

  loadItems() {
    // Simulate fetching items from a service or API
    this.masonryItems = [
      { title: 'Card 1', description: 'Description 1', height: 150, width: 200 },
      { title: 'Card 2', description: 'Description 2', height: 200, width: 250 },
      { title: 'Card 3', description: 'Description 3', height: 180, width: 180 },
      // Add more items as needed
    ];
  }
}