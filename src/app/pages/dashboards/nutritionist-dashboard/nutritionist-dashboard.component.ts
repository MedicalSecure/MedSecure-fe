import { Component } from '@angular/core';
import { TaskComponent } from "../../../components/task/task.component";
import { LeaveReportComponent } from "../../../components/leave-report/leave-report.component";
import { TopUrgencyCasesComponent } from "../../../components/top-urgency-cases/top-urgency-cases.component";
import { ActivitiesComponent } from "../../../components/activities/activities.component";
import { DietService } from '../../../services/diet/diet.service';
import { MultiSenseWidgetComponent } from "../../../components/widgets/multisense-widget/multisense-widget.component";
import { WidgetsAllDataComponent } from "../../../components/list-widget/widgets-all-data/widgets-all-data.component";
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import foods, { Food } from '../../../model/Diet';
import { RendementPrescriptionComponent } from "../../../components/widgets/rendement-prescription/rendement-prescription.component";
import { PrescriptionService } from '../../../services/prescription/prescription.service';
import { VisitService } from '../../../services/visits/visits.service';

@Component({
    selector: 'app-nutritionist-dashboard',
    standalone: true,
    templateUrl: './nutritionist-dashboard.component.html',
    styleUrl: './nutritionist-dashboard.component.css',
    imports: [NgbPaginationModule, NgbTypeaheadModule, TaskComponent, LeaveReportComponent, TopUrgencyCasesComponent, ActivitiesComponent, MultiSenseWidgetComponent, WidgetsAllDataComponent, RendementPrescriptionComponent]
})
export class NutritionistDashboardComponent {


  patientNumber: number = 100;
checkedIn: number = 80;
checkedOut: number = 20;
hospitilized: number = 12;
onProgress: number = 0;
totalVisitsCount: number = 0;
totalPrescriptionCount:number =0;
visitsCountByDay : number =0;

constructor(public dietService : DietService , public prescriptionService : PrescriptionService , public visitService : VisitService ){
  this.refreshCountries();

}
  ngOnInit(): void {
  }
  page = 1;
	pageSize = 4;
	collectionSize = COUNTRIES.length;
	countries: Food[];

  GetTotalVisits(): void {
    this.visitService.getTotalVisitsCount().subscribe(count => {
      this.totalVisitsCount = count;
    }
    );
  }
  
  visitDates(): string[] {
    return Object.keys(this.visitsCountByDay).sort();
  }

  GetVisitsPerDay(): void {
    this.visitService.getVisitsCountByToday().subscribe(count => {
      this.visitsCountByDay = count;
    });
  }
	refreshCountries() {
		this.countries = COUNTRIES.map((country, i) => ({ id: i + 1, ...country })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}
  GetTotalPrescription(): void {
    this.prescriptionService.getCountPrescriptions().subscribe(count => {
      this.totalPrescriptionCount = count;
    }
    );
  }
}

export 
interface Country {
	id?: number;
	name: string;
	flag: string;
	area: number;
	population: number;
}

const COUNTRIES:Food[] = foods ;
 
