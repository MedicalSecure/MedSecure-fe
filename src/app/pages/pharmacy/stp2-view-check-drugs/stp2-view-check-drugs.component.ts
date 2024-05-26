import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MedicationType, tryParseDate } from '../stp1-import-map-drugs/stp1-import-map-drugs.component';
import { DrugService } from '../../../services/medication/medication.service';
import { DrugDTO } from '../../../types/DrugDTOs';
import { firstValueFrom } from 'rxjs';
import { ErrorMessageComponent } from '../../../components/error-message/error-message.component';

@Component({
  selector: 'app-stp2-view-check-drugs',
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    ErrorMessageComponent
  ],
  templateUrl: './stp2-view-check-drugs.component.html',
  styleUrls: ['./stp2-view-check-drugs.component.css'],
})
export class Stp2ViewCheckDrugs implements OnInit, OnChanges {
  @Input() mappedMedications: MedicationType[] = [];
  @Output() onIsStep2PageValidChange = new EventEmitter<boolean>();
  @Output() ValidDrugsEvent = new EventEmitter<DrugDTO[]>();

  @ViewChild(ErrorMessageComponent)
  errorMessageComponent!: ErrorMessageComponent;

  displayedColumns: string[] = [
    'name',
    'dosage',
    'form',
    'code',
    'expired At',
    'unit',
    'stock',
    'alert Stock',
    'average Stock',
    'minimum Stock',
    'safety Stock',
    'price',
    'description',
  ];

  dataSource = new MatTableDataSource<MedicationType>();

  isLoading: boolean = true;

  constructor(private drugService: DrugService) {}

  ngOnInit(): void {
    this.updateDataSource();
    console.log(this.mappedMedications);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.onIsStep2PageValidChange.emit(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mappedMedications']) {
      this.updateDataSource();
    }
  }


  displayNewErrorMessage(
    content: string,
    duration = 4,
    title: string = 'Error : '
  ) {
    this.errorMessageComponent.openSnackBar(content, duration, title);
  }

  private updateDataSource() {
    this.dataSource.data = this.mappedMedications;
    console.log(this.mappedMedications);
  }

  private isDrugValide(drug: MedicationType): boolean {
    return drug.IsDosageValid === true && drug.IsDrugExist === true;
  }

  async handleSubmit():Promise<boolean> {
    const validDrugs: MedicationType[] = this.mappedMedications.filter(
      this.isDrugValide
    );
    if (validDrugs.length === 0) {
      this.displayNewErrorMessage('No valid medication to add to database');
      return false;
    }
    const drugsToAdd: DrugDTO[] = validDrugs.map((drug) => ({
      name: drug.Name,
      dosage: drug.Dosage,
      form: drug.Form,
      code: drug.Code,
      unit: drug.Unit,
      description: drug.Description,
      expiredAt: tryParseDate(drug.ExpiredAt),
      stock: Number(drug.Stock),
      alertStock: Number(drug.AlertStock),
      avrgStock: Number(drug.AverageStock),
      minStock: Number(drug.MinimumStock),
      safetyStock: Number(drug.SafetyStock),
      price: Number(drug.Price),
    }));


    try {
      let postDrugsResponse = await firstValueFrom(this.drugService.postDrugs(drugsToAdd))
      console.log('Drug added successfully, response : ', postDrugsResponse);
      console.log('List added medications', drugsToAdd);
      this.onIsStep2PageValidChange.emit(true);
      this.ValidDrugsEvent.emit(drugsToAdd);
      return true;
    } catch (error) {
      console.error('Error adding drug', error);
        return false;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDosageStyle(isDosageValid: boolean | string | undefined): {
    [key: string]: string;
  } {
    return isDosageValid === false ? { color: 'red', fontWeight: 'bold' } : {};
  }

  getRowClassStyle(isDosageValid: boolean | string | undefined): string[] {
    return isDosageValid === false ? ['bg-warning'] : [];
  }

  onDosageChange(element: MedicationType, event: Event) {
    const input = event.target as HTMLInputElement;
    element.Dosage = input.value;
  }
}
