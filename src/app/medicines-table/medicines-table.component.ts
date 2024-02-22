import { Component, OnInit } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Medicine } from './medicine.model';
import * as XLSX from 'xlsx';
import { CommunicationService } from '../Services/communication-service.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { ColumnMappingDialogComponent } from '../column-mapping-dialog/column-mapping-dialog.component';

@Component({
  selector: 'app-medicines-table',
  standalone: true,
  imports: [MatTableModule, MatHeaderRowDef, MatRowDef, NgFor, FormsModule, MatFormField],
  templateUrl: './medicines-table.component.html',
  styleUrl: './medicines-table.component.css'
})

export class MedicinesTableComponent implements OnInit {
  headers: string[] = [];
  excelData: any[] = []; // Data from Excel file
  excelHeaders: string[] = []; // Headers from Excel file
  displayedColumns: string[] = ['medicineName', 'dosage', 'dosageForm', 'quantity', 'reservedQuantity', 'manufacturer', 'expirationDate', 'price', 'prescriptionRequired', 'indications']; // Columns of your datatable
  dataSource = new MatTableDataSource<any>([]);
  excelColumns: string[] = [];
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

  constructor(private communicationService: CommunicationService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.exportToXlsx();
    this.importExcelData()
  }

  
  

  importExcelData() {
    this.communicationService.importExcel$.subscribe(data => {
      const workbook = XLSX.read(data, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Extract Excel headers
      const excelHeaders = jsonData[0];

      // Open the popup dialog for column mapping
      const dialogRef = this.dialog.open(ColumnMappingDialogComponent, {
        width: '500px',
        height: '400px',
        data: {
          excelColumns: excelHeaders,
          displayedColumns: this.displayedColumns,
          columnMappings: this.columnMappings,
        }
      });

      // Subscribe to dialog closed event to get mapped columns
      dialogRef.afterClosed().subscribe(mappedColumns => {
        if (mappedColumns) {
          // Process mapped columns and update data source for the table
          const mappedData = jsonData.slice(1).map((row: any[]) => {
            const mappedRow: any = {};
            excelHeaders.forEach((header, index) => {
              const displayedColumn = mappedColumns[header];
              if (displayedColumn) {
                mappedRow[displayedColumn] = row[index];
              }
            });
            return mappedRow;
          });
          this.dataSource.data = mappedData;
        }
      });
    });
  }

  mapColumns(mappedColumns: any) {
    const mappedData = this.excelData.map((row: any[]) => {
      const mappedRow: any = {};
      this.excelHeaders.forEach((header, index) => {
        const displayedColumn = mappedColumns[header];
        if (displayedColumn) {
          mappedRow[displayedColumn] = row[index];
        }
      });
      return mappedRow;
    });
  
    this.dataSource.data = mappedData;
  }


  


  exportToXlsx() {
    this.communicationService.exportToXlsx$.subscribe(() => {
      let data: Medicine[] = this.dataSource.filteredData || []; // If data is empty, use an empty array

      const xlsxData = this.convertToXlsx(data);
      this.downloadFile(xlsxData, 'medicines.xlsx');
    });
  }

  convertToXlsx(data: Medicine[]): ArrayBuffer {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const headers = this.displayedColumns.map(column => column.charAt(0).toUpperCase() + column.slice(1));
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Medicines');
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  }

  downloadFile(data: ArrayBuffer, filename: string) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // openColumnMappingDialog() {
  //   // Check if excelColumns data is available
  //   if (!this.excelColumns || this.excelColumns.length === 0) {
  //     console.error('Excel data is empty, undefined, or null.');
  //     return;
  //   }

  //   const dialogRef = this.dialog.open(ColumnMappingDialogComponent, {
  //     width: '400px',
  //     data: {
  //       excelColumns: this.excelColumns, // Pass excelColumns property to dialog
  //       // Pass other data as needed
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(mappedColumns => {
  //     if (mappedColumns) {
  //       console.log('Mapped Excel Column:', mappedColumns.selectedExcelColumn);
  //       console.log('Mapped Displayed Column:', mappedColumns.selectedDisplayedColumn);
  //       // Implement further logic as needed
  //     }
  //   });
  // }
}




