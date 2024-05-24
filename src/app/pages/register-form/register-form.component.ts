import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  WizardHeaderComponent,
  wizardStepType,
} from '../../components/wizard-header/wizard-header.component';

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

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, RouterModule, WizardHeaderComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent implements OnInit {
  items: Item[] = [];
  activities: Activity[] = [];
  habits: Smoking[] = [];
  cardio: Item[] = [];
  allergySymptoms: Symptom[] = [];
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

  constructor(private _formBuilder: FormBuilder) {}

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
