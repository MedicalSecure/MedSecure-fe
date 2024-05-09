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
    Id: string;
    PatientId: string;
    DietType: DietType;
    StartDate: Date;
    EndDate: Date;
    Meals: MealDto[];
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

