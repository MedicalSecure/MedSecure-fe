import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
  groups: Group[];
}

export interface Symptom {
  id: string;
  name: string;
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent implements OnInit{
  items: Item[] = [];
  activities : Activity[]= [];
  habits : Smoking[]= [];
  cardio: Item[]= [];
  allergySymptoms: Symptom[]= [];

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
    this.cardio =[{
      id: 'Kidneydiseases',
      name: 'Cardiovascular risk factors',
      groups: [
        {
          name: 'Family history of chronic kidney disease',
          expand: false,
            checked: false,
          children: [],
        },{
          name: 'Family history of hypertension',
          expand: false,
            checked: false,
          children: [],
        },{
          name: 'Family history of premature cardiovascular disease',
          expand: false,
            checked: false,
          children: [],
        }]}];
  }

  // Function to load items
  loadItems(): void 
  {
    this.items = [
      {
        id: 'diabetes',
        name: 'Diabetes',
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
                name: 'hypertension-included left ventricular hypertrophy',
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
      
    ];
  }

  // Function to load typesOfAllergies
  loadAllergySymptoms(): void {
    this.allergySymptoms = [
      { id: 'food', name: 'Food Allergies' },
      { id: 'environmental', name: 'Environmental Allergies' },
      { id: 'insect-sting', name: 'Insect Sting Allergies' },
      { id: 'medication', name: 'Medication Allergies' },
      { id: 'skin', name: 'Skin Allergies' },
      { id: 'pet', name: 'Pet Allergies' },
      { id: 'occupational', name: 'Occupational Allergies' },
    ];
  }

  parentCheckbox: boolean = false;
 
  selectedGender: string = '';
  type1Checked: boolean = false;
  type1Expand: boolean = false;

  isLinear = false;
  

  expandedElement: Group | null = null;

  toggleExpanded(group:Group): void {
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
  currentStep: number = 1;

  // Function to handle the "Next" button click
  onNextClick(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  // Function to handle the "Previous" button click
  onPrevClick(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectActivity(_t90: any) {
    throw new Error('Method not implemented.');
    }

  onClick(stepNumber: number): void {
    this.currentStep = stepNumber;
  }
}
