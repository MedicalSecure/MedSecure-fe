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
import { MedicationType, tryParseDateOnlyFromExcel } from '../stp1-import-map-drugs/stp1-import-map-drugs.component';
import { DrugService } from '../../../services/medication/medication.service';
import { DrugDTO } from '../../../model/Drugs';
import { firstValueFrom } from 'rxjs';
import { snackbarMessageType } from '../../../components/snack-bar-messages/snack-bar-messages.component';
import { SnackBarMessagesService } from '../../../services/util/snack-bar-messages.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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
  ],
  templateUrl: './stp2-view-check-drugs.component.html',
  styleUrls: ['./stp2-view-check-drugs.component.css'],
})
export class Stp2ViewCheckDrugs implements OnInit, OnChanges {
  @Input() mappedMedications: MedicationType[] = [];
  @Output() onIsStep2PageValidChange = new EventEmitter<boolean>();
  @Output() ValidDrugsEvent = new EventEmitter<DrugDTO[]>();



  displayedColumns: string[] = [
    'name',
    'dosage',
    'form',
    'code',
    'expired At',
    'unit',
    'stock',
    'price',
    'description',
  ];

  dataSource = new MatTableDataSource<MedicationType>();

  isLoading: boolean = true;

  constructor(private drugService: DrugService,private snackBarMessagesService:SnackBarMessagesService) {}

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
    this.snackBarMessagesService.displaySnackBarMessage(content,snackbarMessageType.Error,duration,true)

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
      expiredAt: tryParseDateOnlyFromExcel(drug.ExpiredAt),
      stock: Number(drug.Stock),
      alertStock: Number(0),
      reservedStock:Number(0),
      avrgStock: Number(0),
      minStock: Number(0),
      safetyStock: Number(0),
      price: Number(drug.Price),
    }));
    console.log(JSON.stringify(drugsToAdd));
    

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

  ExportExcel() {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
  
    // Filter out invalid drugs
    const invalidDrugs: MedicationType[] = this.mappedMedications.filter(drug => !this.isDrugValide(drug));
  
    if (invalidDrugs.length > 0) {
      // Prepare data for export
      const exportData: DrugDTO[] = invalidDrugs.map((drug) => ({
        name: drug.Name,
        dosage: drug.Dosage,
        form: drug.Form,
        code: drug.Code,
        unit: drug.Unit,
        description: drug.Description,
        expiredAt: tryParseDateOnlyFromExcel(drug.ExpiredAt),
        stock: Number(drug.Stock),
        alertStock: Number(0),
        avrgStock: Number(0),
        minStock: Number(0),
        safetyStock: Number(0),
        price: Number(drug.Price),
      }));
  
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: fileType });
  
      FileSaver.saveAs(dataBlob, 'invalid_drugs' + fileExtension);
    } else {
      // Handle case where there are no invalid drugs to export
      console.log('No invalid drugs to export.');
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
