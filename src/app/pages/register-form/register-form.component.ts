import { patientType } from './../add-prescription/patient-select/patient-select.component';
import { RegistrationService } from './../../services/registration/registration.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  WizardHeaderComponent,
  wizardStepType,
} from '../../components/wizard-header/wizard-header.component';
import { register } from './../../model/Registration';
// Interfaces

interface Activity {
  value: string;
  viewValue: string;
}
interface Smoking {
  value: string;
  viewValue: string;
}
interface Subtask {
  name: string;
  completed: boolean;
  color: string;
}

// Tree
interface Child {
  name: string;
  checked: boolean;
}

interface Group {
  name: string;
  expand: boolean;
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
type FormPatient = FormGroup<{
  firstName :FormControl;
  lastName :FormControl;
  datOfBirth :FormControl;
  identity :FormControl;
  cnam :FormControl;
  assurance :FormControl;
  gender :FormControl;
  height :FormControl;
  weight :FormControl;
  addressIsRegisterations :FormControl;
  saveForNextTime : FormControl;
  email:FormControl;
  address1:FormControl;
  address2:FormControl;
  activityStatus:FormControl;
  country:FormControl;
  state:FormControl;
  zipCode:FormControl;
  familyStatus:FormControl;
  children:FormControl;
}>;

type FormRiskFactor = FormGroup<{
  key : FormControl;
  value: FormControl;
  isSelected: FormControl;
  subRiskFactor : FormArray<FormSubRiskFactor>;
}>;

type FormSubRiskFactor = FormGroup<{
  key : FormControl;
  value: FormControl;
  isSelected: FormControl;
}>

type FormTest = FormGroup<{
  code : FormControl;
  description : FormControl;
  language :  FormControl;
  typeTest : FormControl;
}>

type FormHistory = FormGroup<{
  date  : FormControl;
  status  : FormControl;
  registerId : FormControl;
}>

type Form = FormGroup<{
    patients :  FormArray<FormPatient>;
    // patientId :  FormControl;
    tests:FormArray<FormTest>
    familyMedicalHistory : FormArray<FormRiskFactor>;
    personalMedicalHistory: FormArray<FormRiskFactor>;
    disease: FormArray<FormRiskFactor>;
    allergy: FormArray<FormRiskFactor>;
    histories: FormArray<FormHistory>;
}>

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,WizardHeaderComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RegisterFormComponent implements OnInit {
  // registerForm!: FormGroup;
  items: Item[] = [];
  activities: Activity[] = [];
  habits: Smoking[] = [];
  cardio: Item[] = [];
  // allergySymptoms: Symptom[] = [];
  stepNumber: number = 1;

  steps: wizardStepType[] = [
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

  // The Form
 fb = inject(NonNullableFormBuilder);
 registerForm: Form = this.fb.group({
    patients : this.fb.array<FormPatient>([this.generatePatient()]),
    tests : this.fb.array<FormTest>([this.generateTest()]),
    familyMedicalHistory: this.fb.array<FormRiskFactor>([this.generateRiskFactor()]),
    personalMedicalHistory: this.fb.array<FormRiskFactor>([this.generateRiskFactor()]),
    disease: this.fb.array<FormRiskFactor>([this.generateRiskFactor()]),
    allergy: this.fb.array<FormRiskFactor>([this.generateRiskFactor()]),
    histories: this.fb.array<FormHistory>([this.generateHistory()]),
  });
 fba= inject(NonNullableFormBuilder);
 
  // Generate
  generatePatient(): FormPatient {
    return this.fb.group({
    firstName: '',
    lastName: '',
    datOfBirth : new Date(),
    identity : '',
    cnam: 0,
    assurance: '',
    gender: 0,
    height : 0,
    weight :0,
    addressIsRegisterations : 0,
    saveForNextTime : 0,
    email: '',
    address1:'',
    address2:'',
    activityStatus:0,
    country:0,
    state:'',
    zipCode:0,
    familyStatus:0,
    children:0
    });
  }
 
  generateTest():FormTest{
    return this.fb.group({
    code : '',
    description :'',
    language : 0,
    typeTest : 0,
    })
  }

  generateRiskFactor():FormRiskFactor{
    return this.fb.group({
      key :'',
      value :'',
      isSelected:0,
      subRiskFactor : this.fb.array<FormSubRiskFactor>([])
      
    })
  }

  generateHistory():FormHistory{
    return this.fb.group({
      date : new Date(),
    status : 0,
    registerId : ''
    })
  }
///
  ngOnInit(): void {
    // Load activities
    this.loadActivities();
    // Load habits
    this.loadHabits();
    // Load cardio
    this.loadCardio();
    // Load items
    this.loadItems();
    // Load typesOfAllergies
    this.loadAllergySymptoms();
  }

  Register: register | any;
  onSubmit() {
    console.log('test',this.registerForm);
    
  }

  tryParseNumber(input: string): number {
    try {
      let result = parseInt(input);
      if (isNaN(result)) return 0;
      return result;
    } catch (error) {
      return 0;
    }
  }

  SwitchToStep(number: number) {
    this.stepNumber = number;
  }
  // Function to load activities
  loadActivities(): void {
    // load activities goes here
    this.activities = [
      { value: 'light-0', viewValue: 'light' },
      { value: 'Medium-1', viewValue: 'Medium' },
      { value: 'Intense-2', viewValue: 'Intense' },
    ];
  }

  // Function to load habits
  loadHabits(): void {
    this.habits = [
      { value: 'light-0', viewValue: 'light' },
      { value: 'Medium-1', viewValue: 'Medium' },
      { value: 'Heavy-2', viewValue: 'Heavy' },
    ];
  }

  // Function to load cardio
  loadCardio(): void {
    this.cardio = [
      {
        id: 'cardiovascular',
        name: 'Cardiovascular risk factors',
        icon: 'fas fa-solid fa-heart',
        groups: [
          {
            name: 'Family history of chronic kidney disease',
            expand: false,
            checked: false,
            children: [],
          },
          {
            name: 'Family history of hypertension',
            expand: false,
            checked: false,
            children: [],
          },
          {
            name: 'Family history of premature cardiovascular disease',
            expand: false,
            checked: false,
            children: [],
          },
        ],
      },
    ];
  }

  // Function to load items
  loadItems(): void {
    this.items = [
      {
        id: 'diabetes',
        name: 'Diabetes',
        icon: 'fas fa-solid fa-syringe',
        groups: [
          {
            name: 'Type 1 diabetes mellitus',
            expand: false,
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
            expand: false,
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
            expand: false,
            checked: false,
            children: [],
          },
          {
            name: 'Documented atherosclerotic cardiovascular disease',
            expand: false,
            checked: false,
            children: [{ name: 'Diabetic neuropathy', checked: false }],
          },
          {
            name: 'Hypertension cardiovascular disease',
            expand: false,
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
            expand: false,
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
            expand: false,
            checked: false,
            children: [
              { name: 'Patient under lipid-lowering drugs', checked: false },
            ],
          },
          {
            name: 'Familial hypercholesterolemia',
            expand: false,
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
            expand: false,
            checked: false,
            children: [],
          },
          {
            name: 'Chronic kidney diseases',
            expand: false,
            children: [],
            checked: false,
          },
          {
            name: 'Congenital anomalies of kidney and urinary tract',
            expand: false,
            checked: false,
            children: [],
          },
          {
            name: 'Polycystic kidney disease',
            expand: false,
            checked: false,
            children: [],
          },
          {
            name: 'Recurrent urinary tract infection',
            expand: false,
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
            expand: false,
            checked: false,
            children: [],
          },
          {
            name: 'Completed vaccination against hepatitis B virus',
            expand: false,
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
            expand: false,
            checked: false,
            children: [],
          },
          {
            name: 'Occupational exposure to lead , cadmium or mercury',
            expand: false,
            children: [],
            checked: false,
          },
          {
            name: 'Smoking',
            expand: false,
            checked: false,
            children: [],
          },
        ],
      },
    ];
  }

  selectedIconData!: string;

  selectItem(item: { icon: string }) {
    const iconData = item.icon;
    const regex = /src="([^"]+)"/g; // Regular expression to find the image URL

    const match = regex.exec(iconData);
    if (match) {
      const imageUrl = match[1]; // Capture the first group (image URL)
      console.log(imageUrl); // This will log the extracted image URL
    } else {
      console.error('No image URL found in icon data');
    }
  }

  allergyCategories: { name: string, symptoms: { id: string, name: string }[], icon: string }[] = [];

  countries: string[] = [
    'Tunisia',
  ];

  states: string[] = [
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
    'Zaghouan'
  ];
  // Function to load typesOfAllergies
  loadAllergySymptoms(): void {
    this.allergyCategories = [
      {
        name: 'Respiratory Allergies',
        icon: 'fas fa-solid fa-lungs',
        symptoms: [
          { id: 'hay-fever', name: 'Hay Fever (Allergic Rhinitis)' },
          { id: 'sneezing', name: 'Sneezing' },
          { id: 'itching-nose', name: 'Itching of the Nose' },
          { id: 'runny-nose', name: 'Runny Nose' },
          { id: 'watery-eyes', name: 'Watery Eyes' }
        ]
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
          { id: 'flaking-peeling-skin', name: 'Flaking or Peeling Skin' }
        ]
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
          { id: 'itching-hives', name: 'Itching or Hives All Over the Body' }
        ]
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
          { id: 'nausea-vomiting', name: 'Nausea and Vomiting' }
        ]
      }
    ];
  }
  
  maritals = [
    { viewValue: 'Single' },
    { viewValue: 'Married' },
    { viewValue: 'Divorced' },
    { viewValue: 'Widowed' }
  ];

  childrens = [
    { viewValue: 'None' },
    { viewValue: '1' },
    { viewValue: '2' },
    { viewValue: '3 or more' }
  ];
  


  parentCheckbox: boolean = false;

  selectedGender: string = '';
  type1Checked: boolean = false;
  type1Expand: boolean = false;

  isLinear = false;

  expandedElement: Group | null = null;

  toggleExpanded(group: Group): void {
    group.expand = !group.expand;
  }

  checkParent(group: Group): void {
    group.checked = group.checked !== undefined ? !group.checked : true;
    group.children.forEach(
      (child) => (child.checked = group.checked !== undefined && group.checked)
    );
  }

  checkChild(group: Group, child: Child): void {
    child.checked = child.checked !== undefined ? !child.checked : true;
    group.checked = group.children.every(
      (c) => c.checked !== undefined && c.checked
    );
  }

  onItemChange(event: any, child: Child): void {
    // Handle checkbox change logic
    console.log('Checkbox changed:', event.target.checked, child.name);
  }

  constructor(private _formBuilder: FormBuilder,public registrationService: RegistrationService,
    private router: Router) {}

  // Region wizard
  currentStep: number = 1; // Initialize current step to 1

  // Function to handle the "Next" button click
  onNextClick(): void {
    if (this.stepNumber < 4) {
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
    this.stepNumber = 1;
  }

  selectActivity(_t90: any) {
    throw new Error('Method not implemented.');
  }

  onClick(stepNumber: number): void {
    this.currentStep = stepNumber;
  }
}
