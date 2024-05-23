import { DietType, FoodCategory, MealType } from "../enums/DietEnums";
import { Gender } from "../enums/enum";
export type GetDietResponse = {
    diets: {
      pageIndex: number;
      pageSize: number;
      count: number;
      data: DietDto[];
    };
  };

  
export type DietDto = {
    id: string;
    patientId: string;
    dietType: DietType;
    startDate: Date;
    endDate: Date;
    meals: MealDto[];
};

export type FoodDto = {
    Id: string;
    MealId: string;
    Name: string;
    Calories: number;
    Description: string;
    FoodCategory: FoodCategory;
};

export type MealDto = {
    Id: string;
    DietId: string;
    Name: string;
    MealType: MealType;
    Foods: FoodDto[];
};

export type PatientDto = {
    Id: string;
    FirstName: string;
    LastName: string;
    DateOfBirth: Date;
    Gender: Gender;
};

