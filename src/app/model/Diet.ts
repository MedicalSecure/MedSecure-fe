
export interface Diet {
  id : string , 
    meals: Meal[];
    register: SimpleRegisterDto;
    dietType: number;
    startDate: Date;
    endDate: Date;
    label: string;
  }

  export interface DietResponse {
    diets: {
      pageIndex: number;
      pageSize: number;
      count: number;
      data: Diet[];
    };
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
    firstName: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: number;
  };
  
  export interface SimpleRiskFactorDto  {
    Value: string;
    Type: string;
  };
  
  export interface SimpleRegisterDto {
    patient: SimplePatientDto;
    allergies: SimpleRiskFactorDto[];
    disease: SimpleRiskFactorDto[];
  };
  const foods: Food[] = [
    // Category 1
    { name: "Caesar Salad", calories: 150, description: "A classic Caesar salad with croutons and parmesan cheese.", foodCategory: 1 },
    { name: "Greek Salad", calories: 120, description: "A refreshing salad with tomatoes, cucumber, olives, and feta cheese.", foodCategory: 1 },
    { name: "Caprese Salad", calories: 130, description: "Sliced mozzarella, tomatoes, and fresh basil, seasoned with salt and olive oil.", foodCategory: 1 },
    { name: "Waldorf Salad", calories: 180, description: "A fruit and nut salad with apples, celery, grapes, and walnuts.", foodCategory: 1 },
    { name: "Garden Salad", calories: 100, description: "Mixed greens with a variety of fresh vegetables and a light vinaigrette.", foodCategory: 1 },
  
    // Category 2
    { name: "Grilled Chicken", calories: 220, description: "Juicy grilled chicken breast seasoned with herbs.", foodCategory: 2 },
    { name: "Steak", calories: 450, description: "Tender and juicy steak grilled to perfection.", foodCategory: 2 },
    { name: "Spaghetti Bolognese", calories: 350, description: "Classic Italian pasta with a rich meat sauce.", foodCategory: 2 },
    { name: "Salmon Fillet", calories: 250, description: "Grilled salmon fillet with a hint of lemon.", foodCategory: 2 },
    { name: "Vegetable Stir-fry", calories: 200, description: "A mix of fresh vegetables stir-fried with soy sauce.", foodCategory: 2 },
  
    // Category 3
    { name: "Orange Juice", calories: 110, description: "Freshly squeezed orange juice.", foodCategory: 3 },
    { name: "Smoothie", calories: 200, description: "A blend of fruits and yogurt for a refreshing drink.", foodCategory: 3 },
    { name: "Lemonade", calories: 90, description: "A sweet and tangy lemonade.", foodCategory: 3 },
    { name: "Iced Tea", calories: 80, description: "Chilled tea served with ice.", foodCategory: 3 },
    { name: "Cappuccino", calories: 100, description: "A classic Italian coffee with steamed milk foam.", foodCategory: 3 },
  
    // Category 4
    { name: "Chocolate Cake", calories: 350, description: "Rich and moist chocolate cake with a creamy frosting.", foodCategory: 4 },
    { name: "Apple Pie", calories: 300, description: "Classic apple pie with a flaky crust.", foodCategory: 4 },
    { name: "Ice Cream", calories: 250, description: "Creamy vanilla ice cream.", foodCategory: 4 },
    { name: "Brownie", calories: 400, description: "Chewy chocolate brownie with nuts.", foodCategory: 4 },
    { name: "Cheesecake", calories: 450, description: "Creamy cheesecake with a graham cracker crust.", foodCategory: 4 }
  ];
  
  export default foods;