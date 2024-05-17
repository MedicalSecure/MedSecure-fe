import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { NavbarComponent } from '../../../partials/navbar/navbar.component';
import { Observable, Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { DrugService } from '../../../services/medication/medication.service';
import { CheckDrugRequest } from '../../../types/DrugDTOs';

@Component({
  selector: 'app-stp1-import-medications',
  standalone: true,
  templateUrl: './stp1-import-medications.component.html',
  styleUrl: './stp1-import-medications.component.css',
  imports: [CommonModule, FormsModule, NavbarComponent, MatSelectModule],
})
export class Stp1ImportMedications implements OnInit {
  @Input() events: Observable<number>;
  @Output() mapMedicationsEvent = new EventEmitter<MedicationType[]>();

  private nextEventSubscription: Subscription;

  importedData: { [key: string]: any }[] = [];
  excelDateFormat = 'dd-mm-yyyy';
  //after mapping :
  mappedData: MedicationType[] = [];
  importedDataHeaders: string[] = [];
  isImportValid: boolean = false;
  isShowImportModal = false;

  columnMappings: MedicationType = {
    Name: '',
    Dosage: '',
    Form: '',
    Code: '',
    Unit: '',
    Stock: '',
    AvailableStock: '',
    ReservedStock: '',
    AlertStock: '',
    AverageStock: '',
    MinimumStock: '',
    SafetyStock: '',
    ExpiredAt: '',
    Price: '',
    Description: '',
  };
  dbHeaders: (keyof MedicationType)[] = Object.keys(
    -this.columnMappings
  ) as (keyof MedicationType)[];

  constructor(private drugService: DrugService) {}

  ngOnInit() {
    this.dbHeaders = Object.keys(
      this.columnMappings
    ) as (keyof MedicationType)[];
    console.log(this.dbHeaders);

    this.nextEventSubscription = this.events.subscribe(() =>
      this.MapMedications()
    );
  }

  ngOnDestroy() {
    this.nextEventSubscription.unsubscribe();
  }

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
        console.log('ligne 83');
        console.log(data);

        // Use the parsed data here, e.g., display it in a table

        if (data && data.length > 0 && Object.keys(data[0]).length > 0) {
          this.importedData = data;
          this.isImportValid = true;
          this.importedDataHeaders = [];
          this.importedDataHeaders.push(...Object.keys(data[0]));
        }
      };
    }
  }

  async MapMedications() {
    let result: MedicationType[] = [];
    for (let importedObj of this.importedData) {
      const newMappedObject: MedicationType = {
        Name: '',
        Dosage: '',
        Form: '',
        Code: '',
        Unit: '',
        Stock: '',
        AvailableStock: '',
        ReservedStock: '',
        AlertStock: '',
        AverageStock: '',
        MinimumStock: '',
        SafetyStock: '',
        ExpiredAt: '',
        Price: '',
        Description: '',
      };
      for (const dbHead of this.dbHeaders) {
        const oldHeader = this.columnMappings[dbHead as keyof MedicationType];
        if (importedObj[oldHeader] !== undefined) {
          newMappedObject[dbHead as keyof MedicationType] =
            importedObj[oldHeader];
        } else {
          newMappedObject[dbHead as keyof MedicationType] = '';
        }
      }
      result.push(newMappedObject);
    }
    this.mappedData = result;
    console.log('child ');

    console.log(result);

    let res = await this.CheckDrugData(result);
    //this.mapMedicationsEvent.emit(result);
  }

  async CheckDrugData(mappedData: MedicationType[]) {
    let request: CheckDrugRequest = {
      drugs: mappedData.map((drug) => {
        return {
          name: drug.Name,
          dosage: drug.Dosage,
          form: drug.Form,
          code: drug.Code,
          unit: drug.Unit,
          description: drug.Description,
          expiredAt: this.tryParseDate(drug.ExpiredAt),
          stock: this.tryParseInt(drug.Stock),
          alertStock: this.tryParseInt(drug.AlertStock),
          avrgStock: this.tryParseInt(drug.AverageStock),
          minStock: this.tryParseInt(drug.MinimumStock),
          safetyStock: this.tryParseInt(drug.SafetyStock),
          reservedStock: this.tryParseInt(drug.ReservedStock),
          price: this.tryParseInt(drug.Price),
        };
      }),
    };
    console.log('ligne 159');
    console.log(request);

    this.drugService.checkDrugs(request).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  tryParseInt(input: string): number {
    let result = 0;
    try {
      result = parseInt(input);
    } catch (error) {}
    if (isNaN(result) || result == undefined || result == null) return 0;
    return result;
  }

  tryParseDate(input: string | Date): string {
    try {
      if (input instanceof Date) {
        return input.toISOString();
      }
      let inputParsed = '';
      if (typeof input == 'string') {
        inputParsed = input.replace(/--/g, '-');
      } else {
        throw new Error('Invalid date');
      }

      let [firstPart, secondPart, third] = inputParsed.split('-').map(Number);

// Create a new Date object in UTC
      //let parts = inputParsed.split('-');

      // let firstPart = parseInt(parts[0]);
      // let secondPart = parseInt(parts[1]);
      // let third = parseInt(parts[2]);
      if (isNaN(third) || isNaN(firstPart) || isNaN(secondPart))
        throw new Error('Invalid date');

      let mIndex = this.excelDateFormat.indexOf('mm');
      let yIndex = this.excelDateFormat.indexOf('yyyy');
      let dIndex = this.excelDateFormat.indexOf('dd');

      let months = 0;
      let days = 0;
      let years = 0;

      if (mIndex < yIndex && mIndex < dIndex && dIndex < yIndex) {
        months = firstPart;
        days = secondPart;
        years = third;
      } else if (mIndex < yIndex && mIndex < dIndex && yIndex < dIndex) {
        months = firstPart;
        days = third;
        years = secondPart;
      } else if (dIndex < yIndex && dIndex < mIndex && mIndex < yIndex) {
        months = secondPart;
        days = firstPart;
        years = third;
      } else if (dIndex < yIndex && dIndex < mIndex && yIndex < mIndex) {
        months = third;
        days = firstPart;
        years = secondPart;
      } else if (yIndex < mIndex && yIndex < dIndex && mIndex < dIndex) {
        months = secondPart;
        days = third;
        years = firstPart;
      } else if (yIndex < mIndex && yIndex < dIndex && dIndex < mIndex) {
        months = third;
        days = secondPart;
        years = firstPart;
      }

      let desiredFormat = 'mm-dd-yyyy';

      let resultDate = desiredFormat;
      resultDate = resultDate.replace('mm', months.toString());
      resultDate = resultDate.replace('dd', days.toString());
      resultDate = resultDate.replace('yyyy', years.toString());

      let result2 = new Date(Date.UTC(years, months - 1, days));

      // Check if the parsed date is valid

      let result = new Date(resultDate);
      if (isNaN(result.getTime())) {
        throw new Error('Invalid date');
      }
      let x = result2.toISOString();
      let y = x+" ";
      return x;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  onSelectchange(event: any, dbColumn: keyof MedicationType) {
    this.columnMappings[dbColumn] = event.target.value;
    if (event.target.value == '') {
      this.columnMappings[dbColumn] = '';
    }
  }
}

export type MedicationType = {
  Name: string;
  Dosage: string;
  Form: string;
  Code: string;
  Unit: string;
  Stock: string;
  AvailableStock: string;
  ReservedStock: string;
  AlertStock: string;
  AverageStock: string;
  MinimumStock: string;
  SafetyStock: string;
  ExpiredAt: string;
  Price: string;
  Description: string;
};
