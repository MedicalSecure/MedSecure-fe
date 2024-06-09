
export interface Diet {
    meals: Meal[];
    register: SimpleRegisterDto;
    dietType: number;
    startDate: Date;
    endDate: Date;
    label: string;
  }

  
  export interface Meal {
    foods: Food[];
    name: string;
    mealType: number;
  }
  
  export interface Food {
    name: string;
    calories: number;
    description: string;
    foodCategory: number;
  }
  export interface SimplePatientDto  {
    FirstName: string;
    LastName?: string;
    DateOfBirth?: Date;
    Gender?: number;
  };
  
  export interface SimpleRiskFactorDto  {
    Value: string;
    Type: string;
  };
  
  export interface SimpleRegisterDto {
    Patient: SimplePatientDto;
    Allergies: SimpleRiskFactorDto[];
    Disease: SimpleRiskFactorDto[];
  };