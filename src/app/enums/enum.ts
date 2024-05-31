export enum TestType {
    ClinicTest = 0,
    LabTest = 1,
    Other = 2,
  }
  
  export enum ActivityStatus {
    Low,
    Medium,
    High,
  }
  
  export enum Children {
    None = 0,
    One = 1,
    Two = 2,
    ThreeOrMore,
  }
  
  export enum EqStatus {
    Available = 1,
    NonAvailable = 2,
  }
  
  export enum FamilyStatus {
    Single,
    Married,
    Divorced,
    Widowed,
  }
  
  export enum Gender {
    Male = 0,
    Female = 1,
    Other = 2,
  }
  
  export enum Language {
    English,
    French,
    Arabic,
    Other,
  }
  
  export enum RoomStatus {
    Pending = 1,
    Activated,
    Deactivated,
  }
  
  export enum Shift {
    Day = 1,
    Night,
    Swing,
  }
  
  export enum HistoryStatus {
    Resident = 0,
    Out = 1,
    Registered = 2,
  }
  
  export enum PrescriptionStatus {
    Draft = 0, // good for filling the initial data, creation process (won't be submitted outside this microservice)
    Pending = 1,
    Active = 2, // Done: validée
    Rejected = 3,
    Discontinued = 4,
    Completed = 5,
  }
  
  export enum RegisterStatus {
    Active = 0,
    Archived = 1,
  }