import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './pharmacy.component.html',
  styleUrl: './pharmacy.component.css',
})
export class PharmacyComponent {
  importedData: { [key: string]: any }[] = [];
  //after mapping :
  mappedData: { [key: string]: any }[] = [];
  importedDataHeaders: string[] = [];
  isImportValid: boolean = false;
  isShowImportModal = false;

  columnMappings: { [key: string]: string } = {
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
  dbHeaders: string[] = Object.keys(this.columnMappings);

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
    let result = [];
    for (let importedObj of this.importedData) {
      const newMappedObject: { [key: string]: any } = {};
      for (const dbHead of this.dbHeaders) {
        const oldHeader = this.columnMappings[dbHead];
        if (importedObj[oldHeader] !== undefined) {
          newMappedObject[dbHead] = importedObj[oldHeader];
        } else {
          newMappedObject[dbHead] = NOT_ASSIGNED;
        }
      }
      result.push(newMappedObject);
    }
    console.log(result);
    this.mappedData = result;
  }

  onClickCloseModal() {
    this.isShowImportModal = false;
  }
  stopPropagation($event: any) {
    $event.stopPropagation();
  }
}
export const NOT_ASSIGNED = 'Not Assigned';
