import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-column-mapping-dialog',
  standalone: true,
  imports: [NgFor,MatFormField,MatLabel,MatSelect,FormsModule,MatOption],
  templateUrl: './column-mapping-dialog.component.html',
  styleUrl: './column-mapping-dialog.component.css'
})
export class ColumnMappingDialogComponent {
  
  selectedExcelColumn: string='';
  selectedDisplayedColumn: string='';
  displayedColumns: string[];
  columnMappings: { [key: string]: string } = {
    'Name': 'medicineName',
    'Dosage': 'dosage',
    'Forme': 'dosageForm',
    'Unit': 'quantity',
    'DCI': 'reservedQuantity',
    'Manufacturer': 'manufacturer',
    'Expiration Date': 'expirationDate',
    'Price': 'price',
    'Prescription Required': 'prescriptionRequired',
    'Indications': 'indications'
  };
  headers: string[] = [];
  availableOptions: any;
  column: any;

  selectedExcelColumn1: string='';
  selectedDisplayedColumn1: string='';
  columnMappings1: any = {}; // Use appropriate type if possible

  selectedExcelColumn2: string='';
  selectedDisplayedColumn2: string='';
  columnMappings2: any = {};

  selectedExcelColumn3: string='';
  selectedDisplayedColumn3: string='';
  columnMappings3: any = {}; // Use appropriate type if possible

  selectedExcelColumn4: string='';
  selectedDisplayedColumn4: string='';
  columnMappings4: any = {};

  selectedExcelColumn5: string='';
  selectedDisplayedColumn5: string='';
  columnMappings5: any = {};


  selectedExcelColumn6: string='';
  selectedDisplayedColumn6: string='';
  columnMappings6: any = {}; // Use appropriate type if possible

  selectedExcelColumn7: string='';
  selectedDisplayedColumn7: string='';
  columnMappings7: any = {};

  
  selectedExcelColumn8: string='';
  selectedDisplayedColumn8: string='';
  columnMappings8: any = {}; // Use appropriate type if possible

  selectedExcelColumn9: string='';
  selectedDisplayedColumn9: string='';
  columnMappings9: any = {}; // Use appropriate type if possible

  selectedExcelColumn10: string='';
  selectedDisplayedColumn10: string='';
  columnMappings10: any = {}; // Use appropriate type if possible
  

  constructor(
    public dialogRef: MatDialogRef<ColumnMappingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.columnMappings = data.columnMappings;
    this.displayedColumns = data.displayedColumns;
    this.headers = data.headers; // Assign headers data
  }

  mapColumns() {
    const mappedColumns = {
        selectedExcelColumn: this.columnMappings,
        selectedDisplayedColumn: this.displayedColumns
    }; 
    return mappedColumns;
}

onSaveMapping() {
  // Emit updated mapping
  const mappedColumns = this.mapColumns();
  
  // Log the values of selectedExcelColumn and selectedDisplayedColumn
  console.log('Selected Excel Column:', mappedColumns.selectedExcelColumn);
  console.log('Selected Displayed Column:', mappedColumns.selectedDisplayedColumn);
}


  finish() {
    this.dialogRef.close(this.columnMappings);
  }

  getUniqueExcelColumns(): string[] {
    return Object.keys(this.columnMappings).filter(column => !this.selectedExcelColumn || column !== this.selectedExcelColumn);
}

  
  getUniqueDisplayedColumns(): string[] {
    return this.displayedColumns.filter(column => !this.selectedDisplayedColumn || column !== this.selectedDisplayedColumn);
  }
  
  getUniqueOptions(header: string): string[] {
    const selectedValue = this.columnMappings[header];
    return this.availableOptions.filter((option: string) => option !== selectedValue);
  }
  
}
