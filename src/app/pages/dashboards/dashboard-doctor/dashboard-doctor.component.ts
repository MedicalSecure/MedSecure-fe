import { Component } from '@angular/core';
import { PatientService } from '../../../services/patient/patient.service'
import { VisitService } from '../../../services/visits/visits.service'
import { UnitCareService } from '../../../services/unit-care/unit-care.service'
import { PrescriptionService } from '../../../services/prescription/prescription.service'
import { CommonModule } from '@angular/common';
import {RendementPrescriptionComponent} from '../../../components/widgets/rendement-prescription/rendement-prescription.component';
import {MedicationsPrescribedComponent} from '../../../components/widgets/medications-prescribed/medications-prescribed.component';
import { ActivitiesComponent } from '../../../components/activities/activities.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LeaveReportComponent } from '../../../components/leave-report/leave-report.component';
import { ToDoComponent } from '../../../components/to-do/to-do.component';
import { RecommendedMedicationsComponent } from '../../../components/widgets/recommended-medications/recommended-medications.component';
import introJs from 'intro.js';
import { TopUrgencyCasesComponent } from '../../../components/top-urgency-cases/top-urgency-cases.component';

@Component({
  selector: 'app-dashboard-doctor',
  standalone: true,
  imports: [CommonModule,RendementPrescriptionComponent,LeaveReportComponent,ToDoComponent,
    MedicationsPrescribedComponent,ActivitiesComponent,RecommendedMedicationsComponent ,NgxPaginationModule,TopUrgencyCasesComponent],
  templateUrl: './dashboard-doctor.component.html',
  styleUrl: './dashboard-doctor.component.css'
})
export class DashboardDoctorComponent {

  //visitsCountByDay: { [key: string]: number } = {};
  visitsCountByDay : number =0;
  totalVisitsCount: number = 0;
  registeredPatientsCount: number = 0;
  ActivatedUnitCaresCount: number = 0;
  UnitCaresCount: number = 0;
  ValidPrescription:number=0;
  InValidPrescription:number=0;
  totalPrescriptionCount:number =0;
  PatientPrescribedcount:number=0;
  page: number = 1;
  constructor(public visitService: VisitService,
    private patientService: PatientService,
    private unitCareService: UnitCareService,
    private prescriptionService :PrescriptionService) { }
    prescriptions: any[];
  ngOnInit(): void {
    this.GetPrescriptions()
    this.GetVisitsPerDay()
    this.GetTotalVisits()
    this.GetRegisteredPatientsCount()
    this.GetCountUnitCares()
    this.GetActivatedUnitCares()
    this.GetValidPrescription()
    this.GetInValidPrescription()
    this.GetTotalPrescription()
    this.GetPatientPrescribed()
    this.startIntro()
  }


  visitDates(): string[] {
    return Object.keys(this.visitsCountByDay).sort();
  }

  GetVisitsPerDay(): void {
    this.visitService.getVisitsCountByToday().subscribe(count => {
      this.visitsCountByDay = count;
    });
  }

  GetTotalVisits(): void {
    this.visitService.getTotalVisitsCount().subscribe(count => {
      this.totalVisitsCount = count;
    }
    );
  }

  GetRegisteredPatientsCount(): void {
    this.patientService.getCountPatientRegister().subscribe(count => {
      this.registeredPatientsCount = count;
      console.log("counttt", this.registeredPatientsCount)
    });
  }

  GetActivatedUnitCares(): void {
    this.unitCareService.getActivatedUnitCares().subscribe(count => {
      this.ActivatedUnitCaresCount = count;
    });
  }
  GetCountUnitCares(): void {
    this.unitCareService.getCountUnitCares().subscribe(count => {
      this.UnitCaresCount = count;
    });
  }

  GetValidPrescription(): void {
    this.prescriptionService.getValidePrescriptions().subscribe(count => {
      this.ValidPrescription = count;
    });
  }
  GetInValidPrescription(): void {
    this.prescriptionService.getInValidePrescriptions().subscribe(count => {
      this.InValidPrescription = count;
    });
  }

  GetTotalPrescription(): void {
    this.prescriptionService.getCountPrescriptions().subscribe(count => {
      this.totalPrescriptionCount = count;
    }
    );
  }
   GetPrescriptions():void{
    this.prescriptionService.getPrescriptions().subscribe(data => {
      this.prescriptions = data;
    });
   }


  GetPatientPrescribed():void{
    this.prescriptionService.getPatientPrescribed().subscribe(data => {
      this.PatientPrescribedcount = data;
    });
   }

   startIntro(): void {
    const intro = introJs();
   
    intro.setOptions({
      scrollToElement: true,
      steps: [
        {
          intro: "Welcome to your dashboard!"
        },
        {
          element: document.querySelector('.statistics-details') as HTMLElement,
          intro: "Here are your information details "
          
        },
        {
          element: document.querySelector('.statistics-title1') as HTMLElement,
          intro: "Here are your patient number non-prescribed."
        },
        {
          element: document.querySelector('.statistics-title2') as HTMLElement,
          intro: "Here are your patient number prescribed."
        },
        {
          element: document.querySelector('.statistics-title3') as HTMLElement,
          intro: "Here are your total Visits."
        },
        {
          element: document.querySelector('.statistics-title4') as HTMLElement,
          intro: "Here are your unitcare available."
        },
        {
          element: document.querySelector('.statistics-title5') as HTMLElement,
          intro: "Here are your Invalid prescriptions."
        },
        {
          element: document.querySelector('.statistics-title6') as HTMLElement,
          intro: "Here are your Valid prescriptions"
        },
        {
          element: document.querySelector('.card1') as HTMLElement,
          intro: "You can see the Recommended medications here."
        },
        {
          element: document.querySelector('.card2') as HTMLElement,
          intro: "You can see the Rendement Prescription here."
        },
        {
          element: document.querySelector('.card3') as HTMLElement,
          intro: "You can see the total visits and Visits per day."
        },
        {
          element: document.querySelector('.card4') as HTMLElement,
          intro: "You can see the Medications prescribed."
        },
        {
          element: document.querySelector('.card5') as HTMLElement,
          intro: "You can see the Liste Prescriptions."
        },
        {
          element: document.querySelector('.card6') as HTMLElement,
          intro: "You can see the Recent Events."
        },
        {
          element: document.querySelector('.card7') as HTMLElement,
          intro: "You can see the activities."
        },
        {
          element: document.querySelector('.card8') as HTMLElement,
          intro: "You can see the to do liste."
        },
        {
          element: document.querySelector('.card9') as HTMLElement,
          intro: "You can see the leave-report."
        },
        {
          element: document.querySelector('.card10') as HTMLElement,
          intro: "You can see the top urgency."
        },
      ]
    });

    intro.start();
  }
}