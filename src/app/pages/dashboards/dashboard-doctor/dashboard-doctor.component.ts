import { Component } from '@angular/core';
import { PatientService } from '../../../services/patient/patient.service'
import { VisitService } from '../../../services/visits/visits.service'
import { UnitCareService } from '../../../services/unit-care/unit-care.service'
import { PrescriptionService } from '../../../services/prescription/prescription.service'
import { CommonModule } from '@angular/common';
import {RendementPrescriptionComponent} from '../../../components/widgets/rendement-prescription/rendement-prescription.component';
import {RecommendedMedicationsComponent} from '../../../components/widgets/recommended-medications/recommended-medications.component';
import {MedicationsPrescribedComponent} from '../../../components/widgets/medications-prescribed/medications-prescribed.component';
import { Patients } from '../../../model/patients';
import { ActivitiesComponent } from '../../../components/activities/activities.component';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-dashboard-doctor',
  standalone: true,
  imports: [CommonModule,RendementPrescriptionComponent,RecommendedMedicationsComponent,
    MedicationsPrescribedComponent,ActivitiesComponent,NgxPaginationModule],
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
  topUrgencyPatients: Patients[] = [];
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
    this. GetPatientPrescribed()
    this.GetTopUrgencyPatient()
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

   GetTopUrgencyPatient(): void {
    this.patientService.getTopUrgencyPatients().subscribe(
      (patients: Patients[]) => {
        this.topUrgencyPatients = patients;
      },
      error => {
        console.error('Error fetching top urgency patients:', error);
      }
    );
  }


  GetPatientPrescribed():void{
    this.prescriptionService.getPatientPrescribed().subscribe(data => {
      this.PatientPrescribedcount = data;
    });
   }
}