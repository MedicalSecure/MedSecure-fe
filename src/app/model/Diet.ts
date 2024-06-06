import { PrescriptionDto } from "./Prescription";

export interface Diet {
    id: string; // Assuming DietId is a string
    meals: Meal[];
    prescription: PrescriptionDto;
    dietType: number;
    startDate: Date;
    endDate: Date;
    label: string;
  }

  
  export interface Meal {
    id: string; 
    foods: Food[];
    name: string;
    mealType: number;
  }
  
  export interface Food {
    id: string;
    name: string;
    calories: number;
    description: string;
    foodCategory: number;
  }