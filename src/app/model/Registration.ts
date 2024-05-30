export interface RegistrationResponse{
    registers: {
        pageIndex: number;
        pageSize: number;
        count: number;
        data: register[]
    };
}

export interface History{
    id: string
    date : Date
    status : number
    registerId:string
}

export interface Patient{
    id : string
    firstName: string
    lastName: string
    dateOfBirth: Date
    identity : string
    cnam: number
    assurance: string
    gender: number
    height : number
    weight : number
    addressIsRegisterations : boolean
    saveForNextTime : boolean
    email: string
    address1:string
    address2:string
    activityStatus:number
    country:number
    state:string
    zipCode:number
    familyStatus:number
    children:number
}

export interface register{
    id:string
    patient : Patient
    // patientId : string
    tests:Test[]
    familyMedicalHistory:RiskFactor[]
    personalMedicalHistory:RiskFactor[]
    disease:RiskFactor[]
    allergy:RiskFactor[]
    histories:History[]
    createdAt: Date
}

export interface Test {
    id : number
    code : string
    description : string
    language : number
    typeTest : number
    registerId : string
}

export interface RiskFactor{
    id : number
    key :string
    value :string
    code:string
    isSelected:boolean
    type:string
    icon :string
    subRiskFactor:SubRiskFactor[]
}

export interface SubRiskFactor{
    id : number
    key :string
    value :string
    code:string
    isSelected:boolean
    type:string
    icon :string
    riskFactorId : string
}
