import { Component, OnInit } from '@angular/core';
import { protectedResources } from '../../auth-config';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';

type DietApiResponse = {
  diets: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: DietPlan[];
  };
};

type DietPlan = {
  id: string;
  patientId: string;
  dietType: number;
  startDate: string;
  endDate?: string;
  meals: Meal[];
};

type Meal = {
  id: string;
  name: string;
  mealType: number;
  foods: Food[];
};

type Food = {
  id: string;
  name: string;
  calories: number;
  description: string;
  foodCategory: number;
};

type PatientApiResponse = {
  patients: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Patient[];
  };
};

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: number;
};

@Component({
  selector: 'app-diet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diet.component.html',
  styleUrl: './diet.component.css',
})
export class DietComponent implements OnInit {
  // Assigning diets and patients endpoints from protectedResources
  dietsEndpoint: string = protectedResources.diet.dietsApi.endpoint;
  patientsEndpoint: string = protectedResources.diet.patientsApi.endpoint;
  
  // Declaring variables for diet plan and patient data
  dietPlan!: DietPlan | any;
  patientData!: Patient | any;

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    this.getDiets();
    this.getPatients();
  }

  getDiets() {
    this.apiService.getDiets().then(
      (data: DietApiResponse ) => {
        console.log('Diets fetched:', data);
        if (data.diets.data.length > 0) {
          
          this.dietPlan = data.diets.data[0]; // Assuming you want the first diet plan
          console.log('First diet plan:', this.dietPlan);
        } else {
          console.error('No diet plans found.');
        }
      },
      (error: any) => {
        console.error('Error fetching diet data:', error);
      }
    );
  }

  getPatients() {
    this.apiService.getPatients().then(
      (data: PatientApiResponse) => {
        console.log('Patients fetched:', data);
        if (data.patients.data.length > 0) {
          this.patientData = data.patients.data[0]; // Assuming you want the first patient
          console.log('First patient:', this.patientData);
        } else {
          console.error('No patient data found.');
        }
      },
      (error: any) => {
        console.error('Error fetching patient data:', error);
      }
    );
  }
}