import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgIf } from '@angular/common';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgIf,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
})
export class IndexComponent {
  importedData: { [key: string]: any }[] = [];
  //after mapping :
  mappedData: MedicationType[] = [];
  importedDataHeaders: string[] = [];
  isImportValid: boolean = false;
  isShowImportModal = false;

  columnMappings:MedicationType= {
    Name: NOT_ASSIGNED,
    Dosage: NOT_ASSIGNED,
    Forme: NOT_ASSIGNED,
    Unit: NOT_ASSIGNED,
    DCI: NOT_ASSIGNED,
    Manufacturer: NOT_ASSIGNED,
    'Expiration Date': NOT_ASSIGNED,
    Price: NOT_ASSIGNED,
    'Prescription Required': NOT_ASSIGNED,
    Indications: NOT_ASSIGNED,
  };
  dbHeaders = Object.keys(this.columnMappings) as (keyof MedicationType)[];

  constructor(private router: Router) {}

  importExcelData(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.isShowImportModal = true;
      const file = fileList[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as object[] | null;
        // Use the parsed data here, e.g., display it in a table

        if (data && data.length > 0 && Object.keys(data[0]).length > 0) {
          this.importedData = data;
          this.isImportValid = true;
          this.importedDataHeaders = [NOT_ASSIGNED];
          this.importedDataHeaders.push(...Object.keys(data[0]));
          console.log(this.importedData);
          console.log(this.isShowImportModal);
        }
      };
    }
  }

  onClickFinishModal() {
    let result :MedicationType[]= [];
    for (let importedObj of this.importedData) {
      const newMappedObject:MedicationType  = {
        Name: NOT_ASSIGNED,
        Dosage: NOT_ASSIGNED,
        Forme: NOT_ASSIGNED,
        Unit: NOT_ASSIGNED,
        DCI: NOT_ASSIGNED,
        Manufacturer: NOT_ASSIGNED,
        'Expiration Date': NOT_ASSIGNED,
        Price: NOT_ASSIGNED,
        'Prescription Required': NOT_ASSIGNED,
        Indications: NOT_ASSIGNED,
      };;
      for (const dbHead of this.dbHeaders) {
        const oldHeader = this.columnMappings[dbHead as keyof MedicationType];
        if (importedObj[oldHeader] !== undefined) {
          newMappedObject[dbHead as keyof MedicationType] = importedObj[oldHeader];
        } else {
          newMappedObject[dbHead as keyof MedicationType] = NOT_ASSIGNED;
        }
      }
      result.push(newMappedObject);
    }
    this.mappedData = result;
    console.log("mappedData", this.mappedData);
    this.onClickCloseModal();
    this.router.navigate(['/pharmacy'], { state: { mappedData: result } });
    
  }

  onClickCloseModal() {
    this.isShowImportModal = false;
  }

  stopPropagation($event: any) {
    $event.stopPropagation();
  }
}
export const NOT_ASSIGNED = 'Not Assigned';
export type MedicationType = {
  Name: string;
  Dosage: string;
  Forme: string;
  Unit: string;
  DCI: string;
  Manufacturer: string;
  'Expiration Date': string;
  Price: string;
  'Prescription Required': string;
  Indications: string;
};