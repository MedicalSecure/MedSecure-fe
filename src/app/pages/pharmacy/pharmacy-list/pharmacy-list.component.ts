import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DrugService } from '../../../services/medication/medication.service';
import { MedicationType, tryParseDateOnlyFromExcel } from '../stp1-import-map-drugs/stp1-import-map-drugs.component';
import { DrugDTO } from '../../../model/Drugs';
import { SnackBarMessagesService } from '../../../services/util/snack-bar-messages.service';
import { snackbarMessageType } from '../../../components/snack-bar-messages/snack-bar-messages.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { getDateString } from '../../../shared/utilityFunctions';
@Component({
  selector: 'app-pharmacy-list',
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinner,
  ],
  templateUrl: './pharmacy-list.component.html',
  styleUrl: './pharmacy-list.component.css',
})
export class PharmacyListComponent implements OnInit {
  @Input() mappedMedications: MedicationType[] = [];

  @Input() selectedPrescription: any | undefined = undefined;
  @Output() onClickNewMedicationEvent = new EventEmitter<boolean>();
  @Output() onClickViewPrescriptionsEvent = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  displayedColumns: string[] = [
    'name',
    'dosage',
    'form',
    'code',
    'expired At',
    'unit',
    'stock',
    'available Stock',
    'reserved Stock',
    'alert Stock',
    //'average Stock',
    //'minimum Stock',
    'safety Stock',
    'price',
    'description',
  ];
  dataSource = new MatTableDataSource<MedicationType>();

  isLoading: boolean = true;
  searchTerm: string = '';

  constructor(private drugService: DrugService,private snackbarMessages:SnackBarMessagesService) {}

  ngOnInit(): void {
    this.drugService.getData(this.dataSource);
    this.updateDataSource();
    console.log(this.mappedMedications);
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mappedMedications']) {
      this.updateDataSource();
    }
  }

  private updateDataSource() {
    this.dataSource.data = this.mappedMedications;
    console.log(this.mappedMedications);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClickMedication(Medication: any) {
    this.selectedPrescription = Medication;
  }

  onClickNewMedication() {
    this.onClickNewMedicationEvent.emit(false);
    this.onClickMedication(undefined);
  }

  onClickViewPrescriptions() {
    this.onClickViewPrescriptionsEvent.emit(true);
  }

  handleMedicationListExportCsv() {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    if (this.dataSource.data.length > 0) {
      this.snackbarMessages.displaySnackBarMessage("Preparing your file",snackbarMessageType.Info,1)
      // Prepare data for export
      const exportData: DrugDTO[] = this.dataSource.data.map((drug) => ({
        name: drug.Name,
        dosage: drug.Dosage,
        form: drug.Form,
        code: drug.Code,
        unit: drug.Unit,
        description: drug.Description,
        expiredAt: tryParseDateOnlyFromExcel(drug.ExpiredAt),
        stock: Number(drug.Stock),
        alertStock: Number(drug.AlertStock),
        avrgStock: Number(drug.AverageStock),
        minStock: Number(drug.MinimumStock),
        safetyStock: Number(drug.SafetyStock),
        price: Number(drug.Price),
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: fileType });
      setTimeout(() => {
        FileSaver.saveAs(dataBlob, `pharmacy_stock_${getDateString(new Date,"ddmmH_HHMM")}` + fileExtension);
        this.snackbarMessages.displaySnackBarMessage(`File exported: pharmacy_stock_${getDateString(new Date,"ddmmH_HHMM")}`,snackbarMessageType.Success,2)
      }, 1000);
    } else {
      // Handle case where there are no invalid drugs to export
      this.snackbarMessages.displaySnackBarMessage("No medications available for export",snackbarMessageType.Error,2)
    }
  }
}
