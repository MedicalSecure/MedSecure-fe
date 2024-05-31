import { RegistrationService } from './../../services/registration/registration.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  WizardHeaderComponent,
  wizardStepType,
} from '../../components/wizard-header/wizard-header.component';
import { PatientDto, RegisterDto, RiskFactorDto } from '../../model/Registration';
import { Children, FamilyStatus, Gender } from '../../enums/enum';
import { Country } from '../../enums/country';

// Interfaces

interface Activity {
  value: string;
  viewValue: string;
}
interface Child {
  name: string;
  checked: boolean;
}
interface Group {
  name: string;
  checked: boolean;
  children: Child[];
}
interface Item {
  id: string;
  name: string;
  icon: string;
  groups: Group[];
}
export interface Symptom {
  id: string;
  name: string;
}

//Form Control
interface FormPatient {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  dateOfBirth: FormControl<string | null>;
  identity: FormControl<string | null>;
  cnam: FormControl<string | null>;
  assurance: FormControl<string | null>;
  gender: FormControl<string | null>;
  height: FormControl<number | null>;
  weight: FormControl<number | null>;
  addressIsRegisterations: FormControl<boolean | null>;
  saveForNextTime: FormControl<boolean | null>;
  email: FormControl<string | null>;
  address1: FormControl<string | null>;
  address2: FormControl<string | null>;
  activityStatus: FormControl<string | null>;
  country: FormControl<string | null>;
  state: FormControl<string | null>;
  zipCode: FormControl<string | null>;
  familyStatus: FormControl<string | null>;
  children: FormControl<string | null>;
}
@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    WizardHeaderComponent,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RegisterFormComponent implements OnInit {
  isFormValid = true;
  stepNumber: number = 1;
  steps: wizardStepType[] = wizardInitialSteps;

  fb = inject(NonNullableFormBuilder);

  constructor(
    public registrationService: RegistrationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.monitorFormValueChanges();
  }

  onSubmit() {
    //console.log(this.stp1FormGroup.getRawValue());
    //console.log(this.allergyForm.get('selectedSymptoms')?.getRawValue());
    //console.log(this.step3PersonalMedicalHistoryItems);
    //console.log(this.step4FamilyMedHistItems);
    let x =this.getRegisterObject()

    let request={
      register:x
    }
    console.log(JSON.stringify(request));
    
  }

  getPatientObject(): PatientDto {
    const formValue = this.stp1FormGroup.getRawValue();
    const patientDto: PatientDto = {
      firstName: formValue.firstName ?? '',
      lastName: formValue.lastName ?? '',
      dateOfBirth: new Date(formValue.dateOfBirth ?? ''),
      identity: formValue.identity ?? '',
      cnam: Number(formValue.cnam) ?? null,
      assurance: formValue.assurance ?? null,
      gender: parseGenderEnum(formValue.gender),
      height: formValue.height ?? null,
      weight: formValue.weight ?? null,
      addressIsRegistrations: formValue.addressIsRegisterations ?? true,
      saveForNextTime: formValue.saveForNextTime ?? true,
      email: formValue.email ?? null,
      address1: formValue.address1 ?? null,
      address2: formValue.address2 ?? null,
      country: parseCountryEnum(formValue.country),
      state: formValue.state ?? null,
      zipCode: tryParseIntNullable(formValue.zipCode),
      familyStatus: parseFamilyStatusEnum(formValue.familyStatus) ?? null,
      children: parseChildrenEnum(formValue.children) ?? null,
    };
    return patientDto;
  }
  getRegisterObject(): RegisterDto {
    const reg: RegisterDto = {
      patient: this.getPatientObject(),
      allergies: this.getAllergies(),
      diseases: null,
      familyMedicalHistory: this.getMedicalHistory(this.step4FamilyMedHistItems),
      personalMedicalHistory: this.getMedicalHistory(this.step3PersonalMedicalHistoryItems),
      test: null,
      history: null,
    };
    return reg;
  }

  getAllergies(): RiskFactorDto[] {
    let data = this.allergyForm.getRawValue().selectedSymptoms;
    let result: RiskFactorDto[] = [];
    /*  the form of data object : 
    [
      [idSym1,null,idSelectedSym2], (g1)
      [idSym1,null,idSelectedSym2], (g2)
    ] */

    allergyCategoriesInitialValues.forEach((SymptomGroup:step2SymptomType,gIndex:number) => {
      //create new riskFactor
      let newRiskFactor: RiskFactorDto = {
        key: SymptomGroup.name,
        icon: SymptomGroup.icon,
        value: SymptomGroup.name,
        isSelected: true,
        subRiskFactor: [],
      };
      //Fill the subRiskFactor
      SymptomGroup.symptoms.forEach((symptom,symIndex) => {
        if (data[gIndex][symIndex] == null) return;
        let newSubRiskFactor: RiskFactorDto = {
          value:symptom.name,
          key: symptom.id,
          isSelected: true,
        };
        newRiskFactor.subRiskFactor?.push(newSubRiskFactor);
      });
      if (
        newRiskFactor.subRiskFactor?.length &&
        newRiskFactor.subRiskFactor?.length > 0
      )
        result.push(newRiskFactor);//add only the selected groups (has selected symptoms)
    });
    return result;
  }

  getMedicalHistory(data:Item[] = this.step3PersonalMedicalHistoryItems): RiskFactorDto[] {
    let result: RiskFactorDto[] = [];

    data.forEach((item) => {
      if (item.groups.length === 0) return;
      //create new riskFactor
      let newItemRiskFactor: RiskFactorDto = {
        key: item.name,
        value:item.name,
        isSelected: true,
        subRiskFactor: [],
      };
      //Fill the subRiskFactor
      item.groups.forEach((group) => {
        if (group == null || group.checked == false) return;
        //this group is checked => lets continue to children
        let newGroupSubRiskFactor: RiskFactorDto = {
          key: group.name,
          value: group.name,
          isSelected: group.checked,
          subRiskFactor:[]
        };
        group.children.forEach(child=>{
          if(child.checked == false) return;
          //valid child here
          let newChildSubRiskFactor: RiskFactorDto = {
            key: child.name,
            value: child.name,
            isSelected: child.checked,
          };
          //add child to new parent
          newGroupSubRiskFactor.subRiskFactor?.push(newChildSubRiskFactor)
        })
        //add the group, doesnt matter if he has children or no, its checked!
        newItemRiskFactor.subRiskFactor?.push(newGroupSubRiskFactor);
      });

      //Add only the items with checked groups (if the group is checked, it will be added to he subRiskFactors => its length >0)
      if (
        newItemRiskFactor.subRiskFactor?.length &&
        newItemRiskFactor.subRiskFactor?.length > 0
      )
        result.push(newItemRiskFactor);
    });
    return result;
  }

  //******************* STEP1 *****************************************************************************
  countries: string[] = ['Tunisia'];
  states: string[] = tunisianStates;
  today = new Date();
  hundredFiftyYearsAgo = new Date(
    this.today.getFullYear() - 150,
    this.today.getMonth(),
    this.today.getDate()
  );
  stp1FormGroup = getInitialStp1FormGroup();
  maritals = [
    { viewValue: 'Single' },
    { viewValue: 'Married' },
    { viewValue: 'Divorced' },
    { viewValue: 'Widowed' },
  ];
  children = [
    { viewValue: 'None' },
    { viewValue: '1' },
    { viewValue: '2' },
    { viewValue: '3 or more' },
  ];
  activities: Activity[] = [
    { value: 'light-0', viewValue: 'light' },
    { value: 'Medium-1', viewValue: 'Medium' },
    { value: 'Intense-2', viewValue: 'Intense' },
  ];

  monitorFormValueChanges() {
    this.stp1FormGroup.valueChanges.subscribe((newValues) => {
      let c1 = this.stp1FormGroup.controls.firstName.valid;
      let c2 = this.stp1FormGroup.controls.lastName.valid;
      let c3 = this.stp1FormGroup.controls.gender.valid;
      let c4 = this.stp1FormGroup.controls.dateOfBirth.errors === null;
      let c5 = this.stp1FormGroup.controls.identity.valid;
      this.isFormValid = c1 && c2 && c3 && c4 && c5;
    });
  }

  //******************* STE2 *****************************************************************************

  allergyCategories: step2SymptomType[] = allergyCategoriesInitialValues;
  allergyForm: FormGroup = new FormGroup({
    selectedSymptoms: new FormArray([]),
  });

  get selectedSymptoms(): FormArray {
    return this.allergyForm.get('selectedSymptoms') as FormArray;
  }

  onSymptomChange(catIndex: number, symIndex: number, event: any) {
    const symptomControl = this.getSymptomControl(catIndex, symIndex);
    if (event.target.checked) {
      symptomControl.setValue(event.target.value);
    } else {
      symptomControl.reset();
    }
  }
  getSymptomControl(catIndex: number, symIndex: number): FormControl {
    const category = this.allergyForm.get('selectedSymptoms') as FormArray;
    let categoryControls = category.controls[catIndex] as FormArray;
    if (!categoryControls) {
      categoryControls = this.fb.array([]);
      category.push(categoryControls);
    }
    if (!categoryControls.controls[symIndex]) {
      categoryControls.push(new FormControl());
    }
    return categoryControls.controls[symIndex] as FormControl;
  }

  //******************* STEP3 *****************************************************************************
  step3PersonalMedicalHistoryItems: Item[] = JSON.parse(
    JSON.stringify(Step3itemsInitialValues)
  );

  //******************* STEP4 *****************************************************************************
  step4FamilyMedHistItems: Item[] = JSON.parse(
    JSON.stringify(initialFamilyMedicalHistory)
  );

  //******************* STEP 3 & STEP4 ***********************************************************************
  toggleExpanded(group: Group): void {
    group.checked = !group.checked;

    //if a group is deselected, deselect the children oo
    if (group.checked == false) {
      group.children.forEach((child) => (child.checked = false));
    }
  }
  onItemChange(event: any, child: Child): void {
    child.checked = event.target.checked;
  }
  //******************* END STEP 3 & STEP4 ***********************************************************************

  //******************* WIZARD *****************************************************************************
  SwitchToStep(number: number) {
    this.stepNumber = number;
  }
  // Function to handle the "Next" button click
  onNextClick(): void {
    if (this.stepNumber == 4) return this.onSubmit();
    else if (this.stepNumber < 4) {
      this.stepNumber++;
    }
  }
  // Function to handle the "Previous" button click
  onPrevClick(): void {
    if (this.stepNumber > 1) {
      this.stepNumber--;
    }
  }
  // Function to handle the "Cancel" button click
  onCancelClick(): void {
    this.ResetWizard();
    //resubscribe to the new instance of form
    this.monitorFormValueChanges();
  }

  ResetWizard() {
    this.isFormValid = false;
    this.stepNumber = 1;
    //step1
    this.stp1FormGroup = getInitialStp1FormGroup();

    //Step2
    this.allergyForm = new FormGroup({
      selectedSymptoms: new FormArray([]),
    });

    //step3
    //create a new clone with completely different memory id even for the sub objects
    this.step3PersonalMedicalHistoryItems = JSON.parse(
      JSON.stringify(Step3itemsInitialValues)
    );

    //step4
    //create a new clone with completely different memory id even for the sub objects
    this.step4FamilyMedHistItems = JSON.parse(
      JSON.stringify(initialFamilyMedicalHistory)
    );
  }
}

export function parseGenderEnum(gender:string | number | undefined | null):Gender | null{
  if(!gender) return null;
  if(gender == 'Male' || gender == 0 || gender == "male" || gender =="0")
    return Gender.Male
  else if(gender == 'Female' || gender == 1 || gender == "female" || gender =="1")
    return Gender.Female
  else if(gender == 'Other' || gender == 2 || gender == "other" || gender =="2")
    return Gender.Other
  return null;
}

export function parseCountryEnum(country:string | number | undefined | null):Country | null{
  if(!country) return null;
  if(country.toString().toLowerCase() == "tunisia") return Country.TN
  if(country.toString().toLowerCase() == "tunisie") return Country.TN
  if(country.toString().toLowerCase() == "tn") return Country.TN
 //TODO finish ...
  return null;
}

export function parseFamilyStatusEnum(status:string | number | undefined | null):FamilyStatus | null{
  if(!status) return null;
  if(status == 'Single' || status == 0 || status == "single" || status =="0") return FamilyStatus.Single
  if(status == 'Married' || status == 1 || status == "married" || status =="1") return FamilyStatus.Married
  if(status == 'Divorced' || status == 2 || status == "divorced" || status =="2") return FamilyStatus.Divorced
  if(status == 'Widowed' || status == 3 || status == "widowed" || status =="3") return FamilyStatus.Widowed
  return null;
}

export function parseChildrenEnum(child:string | number | undefined | null):Children | null{
  if(!child) return null;
  if(child == 'None' || child == 0 || child == "none" || child =="0")
    return Children.None
  else if(child == 'One' || child == 1 || child == "one" || child =="1")
    return Children.One
  else if(child == 'Two' || child == 2 || child == "two" || child =="2")
    return Children.Two
  else if(child == '3 or more' || child == 3 || child == "3 Or More" || child == "3" || child =="ThreeOrMore")
    return Children.ThreeOrMore
  return null;
}

export function tryParseIntNullable(input: string | number | null): number | null {
  if(input == null || input == undefined) return null;
  let result = 0;
  try {
    result = parseInt(input.toString());
  } catch (error) {
    return null;
  }
  if (isNaN(result) || result == undefined || result == null)  return null;
  return result;
}

export function createFormControl(minLength: number,initValue:string=''): FormControl {
  return new FormControl(initValue, [
    Validators.required,
    Validators.minLength(minLength),
  ]);
}

//INITIALIZE VARIABLES
function getInitialStp1FormGroup() {
  return new FormGroup<FormPatient>({
    firstName: createFormControl(2),
    lastName: createFormControl(2),
    dateOfBirth: new FormControl('',[validDateOfBirth]),
    identity: createFormControl(7),
    cnam: new FormControl(''),
    assurance: new FormControl(''),
    gender: createFormControl(2),
    height: new FormControl(null),
    weight: new FormControl(null),
    addressIsRegisterations: new FormControl(true),
    saveForNextTime: new FormControl(true),
    email: new FormControl('',[Validators.email]),
    address1: new FormControl(''),
    address2: new FormControl(''),
    activityStatus: new FormControl(''),
    country: new FormControl(''),
    state: new FormControl(''),
    zipCode: new FormControl(''),
    familyStatus: new FormControl(''),
    children: new FormControl(''),
  });
}
export function validDateOfBirth(control: AbstractControl): ValidationErrors | null {
  const maxDate = new Date(); // January 1, 1900
  const minDate = new Date(maxDate.getFullYear() - 150,maxDate.getMonth(), maxDate.getDate());

  let dateOfBirth = control.value;

  if (!dateOfBirth) {
    // Allow empty values
    return {required:true};
  }

  try {
    dateOfBirth = new Date(dateOfBirth);
  } catch (error) {
    console.error(`invalid date of birth : ${dateOfBirth}`)
  }

  if (!(dateOfBirth instanceof Date) || isNaN(dateOfBirth.getTime())) {
    // Invalid date
    return { invalidDate: true };
  }

  if (dateOfBirth < minDate || dateOfBirth > maxDate) {
    // Date is out of range
    return { dateOutOfRange: true };
  }

  // Date is valid
  return null;
}

export const tunisianStates: string[] = [
  'Ariana',
  'Beja',
  'Ben Arous',
  'Bizerte',
  'Gabes',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kebili',
  'Kef',
  'Mahdia',
  'Manouba',
  'Medenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan',
];

const initialFamilyMedicalHistory: Item[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular risk factors',
    icon: 'fas fa-solid fa-heart',
    groups: [
      {
        name: 'Family history of chronic kidney disease',

        checked: false,
        children: [],
      },
      {
        name: 'Family history of hypertension',

        checked: false,
        children: [],
      },
      {
        name: 'Family history of premature cardiovascular disease',

        checked: false,
        children: [],
      },
    ],
  },
];

const wizardInitialSteps = [
  {
    id: 1,
    title: 'Patient information',
    matIconName: '',
    iconClass: 'fa fa-user-md',
  },
  {
    id: 2,
    title: 'Allergies',
    matIconName: '',
    iconClass: 'fa fa-medkit',
  },
  {
    id: 3,
    title: 'Personal medical informations',
    matIconName: '',
    iconClass: 'fa fa-stethoscope',
  },
  {
    id: 4,
    title: 'Family medical informations',
    matIconName: '',
    iconClass: 'fa fa-users',
  },
];

const allergyCategoriesInitialValues = [
  {
    name: 'Respiratory Allergies',
    icon: 'fas fa-solid fa-lungs',
    symptoms: [
      { id: 'hay-fever', name: 'Hay Fever (Allergic Rhinitis)' },
      { id: 'sneezing', name: 'Sneezing' },
      { id: 'itching-nose', name: 'Itching of the Nose' },
      { id: 'runny-nose', name: 'Runny Nose' },
      { id: 'watery-eyes', name: 'Watery Eyes' },
    ],
  },
  {
    name: 'Skin Allergies',
    icon: 'fas fa-solid fa-bug',
    symptoms: [
      { id: 'itchy-skin', name: 'Itchy Skin' },
      { id: 'rash', name: 'Rash' },
      { id: 'facial-swelling', name: 'Facial Swelling' },
      { id: 'atopic-dermatitis', name: 'Atopic Dermatitis (Eczema)' },
      { id: 'itchy-red-skin', name: 'Itchy and Red Skin' },
      { id: 'flaking-peeling-skin', name: 'Flaking or Peeling Skin' },
    ],
  },
  {
    name: 'Food and Insect Allergies',
    icon: 'fas fa-solid fa-cookie-bite',
    symptoms: [
      { id: 'food-allergy', name: 'Food Allergy' },
      { id: 'tingling-mouth', name: 'Tingling in the Mouth' },
      { id: 'swelling-lips', name: 'Swelling of the Lips' },
      { id: 'hives-food', name: 'Hives from Food Allergy' },
      { id: 'insect-sting-allergy', name: 'Insect Sting Allergy' },
      { id: 'swelling-sting', name: 'Swelling at Sting Site' },
      { id: 'itching-hives', name: 'Itching or Hives All Over the Body' },
    ],
  },
  {
    name: 'Other Allergies',
    icon: 'fas fa-solid fa-allergies',
    symptoms: [
      { id: 'drug-allergy', name: 'Drug Allergy' },
      { id: 'anaphylaxis', name: 'Anaphylaxis' },
      { id: 'loss-consciousness', name: 'Loss of Consciousness' },
      { id: 'low-blood-pressure', name: 'Low Blood Pressure' },
      { id: 'severe-shortness-breath', name: 'Severe Shortness of Breath' },
      { id: 'lightheadedness', name: 'Lightheadedness' },
      { id: 'rapid-weak-pulse', name: 'Rapid Weak Pulse' },
      { id: 'nausea-vomiting', name: 'Nausea and Vomiting' },
    ],
  },
];

const Step3itemsInitialValues = [
  {
    id: 'diabetes',
    name: 'Diabetes',
    icon: 'fas fa-solid fa-syringe',
    groups: [
      {
        name: 'Type 1 diabetes mellitus',

        checked: false,
        children: [
          { name: 'Diabetic neuropathy', checked: false },
          { name: 'Diabetic retinopathy', checked: false },
          { name: 'Severe target organ damage', checked: false },
          { name: 'Short -standing < 10 years', checked: false },
        ],
      },
      {
        name: 'Type 2 diabetes mellitus',

        checked: false,
        children: [
          { name: 'Diabetic neuropathy', checked: false },
          { name: 'Diabetic retinopathy', checked: false },
          {
            name: 'Insulin-treated type 2 diabetes mellitus',
            checked: false,
          },
          { name: 'Severe target organ damage', checked: false },
          { name: 'Short-standing <10 years', checked: false },
          { name: 'Uncontrolled type 2 diabetes mellitus', checked: false },
        ],
      },
    ],
  },
  {
    id: 'Chronicheartfailure',
    name: 'Chronic heart failure',
    icon: 'fas fa-solid fa-heart-pulse',
    groups: [
      {
        name: 'Documented atherosclerotic cardiovascular disease',

        checked: false,
        children: [],
      },
      {
        name: 'Documented atherosclerotic cardiovascular disease',

        checked: false,
        children: [{ name: 'Diabetic neuropathy', checked: false }],
      },
      {
        name: 'Hypertension cardiovascular disease',

        checked: false,
        children: [
          { name: 'Grade 2', checked: false },
          { name: 'Grade 3', checked: false },
          {
            name: 'hypertension-included LVH',
            checked: false,
          },
          { name: 'hypertension-included retinopathy', checked: false },
          { name: 'Uncontrolled hypertension', checked: false },
        ],
      },
      {
        name: 'Peripheral aneurysms(iliac,femoral,popliteal)',

        checked: false,
        children: [],
      },
    ],
  },
  {
    id: 'Dyslipidemia',
    name: 'Dyslipidemia',
    icon: 'fas fa-solid fa-vial',
    groups: [
      {
        name: 'Dyslipidemia',

        checked: false,
        children: [
          { name: 'Patient under lipid-lowering drugs', checked: false },
        ],
      },
      {
        name: 'Familial hypercholesterolemia',

        children: [],
        checked: false,
      },
    ],
  },
  {
    id: 'Kidneydiseases',
    name: 'Kidney diseases',
    icon: 'fas fa-solid fa-capsules',
    groups: [
      {
        name: 'Acute kidney injury (previous episode)',

        checked: false,
        children: [],
      },
      {
        name: 'Chronic kidney diseases',

        children: [],
        checked: false,
      },
      {
        name: 'Congenital anomalies of kidney and urinary tract',

        checked: false,
        children: [],
      },
      {
        name: 'Polycystic kidney disease',

        checked: false,
        children: [],
      },
      {
        name: 'Recurrent urinary tract infection',

        checked: false,
        children: [],
      },
    ],
  },
  {
    id: 'infectiousAutoimmune',
    name: 'Infectious and autoimmune diseases',
    icon: 'fas fa-solid fa-virus',
    groups: [
      {
        name: 'Autoimmune diseases',

        checked: false,
        children: [],
      },
      {
        name: 'Completed vaccination against hepatitis B virus',

        children: [],
        checked: false,
      },
    ],
  },
  {
    id: 'Lifestyle',
    name: 'Lifestyle and environment',
    icon: 'fas fa-solid fa-seedling',
    groups: [
      {
        name: 'Exposure to nephrotoxic agents',

        checked: false,
        children: [],
      },
      {
        name: 'Occupational exposure to lead , cadmium or mercury',

        children: [],
        checked: false,
      },
      {
        name: 'Smoking',

        checked: false,
        children: [],
      },
    ],
  },
];

type step2SymptomType={
  name: string;
  symptoms: { id: string; name: string }[];
  icon: string;
}