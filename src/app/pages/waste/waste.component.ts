import { Component, OnInit } from '@angular/core';
import { protectedResources } from '../../auth-config';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';

type WasteApiResponse = {
  wastes: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Waste[];
  };
};

type Waste = {
  id: string;
  roomId: string;
  pickupLocation: Location;
  dropOffLocation: Location;
  status: number;
  color: number;
  wasteItems: WasteItem[];
};

type Location = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
};

type WasteItem = {
  id: string;
  wasteId: string;
  productId: string;
  quantity: number;
  weight: number;
};

@Component({
  selector: 'app-waste',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waste.component.html',
  styleUrl: './waste.component.css',
})
export class WasteComponent implements OnInit {
  // Assigning wastes endpoints from protectedResources
  wastesEndpoint: string = protectedResources.api.endpoint;
  
  // Declaring variables for waste data
  wastes!: Waste | any;

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    this.getWastes();
  }

  getWastes() {
    this.apiService.getWastes().then(
      (data: WasteApiResponse ) => {
        console.log('Wastes fetched:', data);
        if (data.wastes.data.length > 0) {
          
          this.wastes = data.wastes.data[0]; // Assuming you want the first waste
          console.log('First Waste:', this.wastes);
        } else {
          console.error('No Waste found.');
        }
      },
      (error: any) => {
        console.error('Error fetching waste data:', error);
      }
    );
  }

}