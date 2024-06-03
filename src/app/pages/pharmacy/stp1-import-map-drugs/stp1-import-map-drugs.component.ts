import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { NavbarComponent } from '../../../partials/navbar/navbar.component';
import { Observable, firstValueFrom } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { DrugService } from '../../../services/medication/medication.service';
import { CheckDrugRequest, CheckDrugResponse } from '../../../model/Drugs';
import { SnackBarMessagesService } from '../../../services/util/snack-bar-messages.service';
import { snackbarMessageType } from '../../../components/snack-bar-messages/snack-bar-messages.component';

@Component({
  selector: 'app-stp1-import-map-drugs',
  standalone: true,
  templateUrl: './stp1-import-map-drugs.component.html',
  styleUrl: './stp1-import-map-drugs.component.css',
  imports: [CommonModule, FormsModule, NavbarComponent, MatSelectModule],
})
@Injectable({
  providedIn: 'root',
})
export class Stp1ImportMapDrugs implements OnInit {
  @Input() events: Observable<number>;
  @Output() CheckedDrugsEvent = new EventEmitter<MedicationType[]>();
  @Output() onIsStep1PageValidChange = new EventEmitter<boolean>();
  @Output() areAllCheckedDrugsValid = new EventEmitter<boolean>();


  importedData: { [key: string]: any }[] = [];
  excelDateFormat = 'dd-mm-yyyy';
 
  mappedDataBeforeCheck: MedicationType[] = [];
  mappedDataAfterCheck: MedicationType[] = [];
  importedDataHeaders: string[] = [];
  isImportValid: boolean = false;

  drugsChecked: CheckDrugResponse;

  columnMappings: Partial<MedicationType> = {
    Name: '',
    Dosage: '',
    Form: '',
    Code: '',
    Unit: '',
    Stock: '',
    AlertStock: '',
    AverageStock: '',
    MinimumStock: '',
    SafetyStock: '',
    ExpiredAt: '',
    Price: '',
    Description: '',
  };
  dbHeaders: (keyof MedicationType)[] = Object.keys(
    this.columnMappings
  ) as (keyof MedicationType)[];

  constructor(private drugService: DrugService,private snackBarMessagesService:SnackBarMessagesService) {}

  ngOnInit() {
    this.dbHeaders = Object.keys(
      this.columnMappings
    ) as (keyof MedicationType)[];
    console.log(this.dbHeaders);

    this.onIsStep1PageValidChange.emit(false);
  }

  importExcelData(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as object[] | null;
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

  async handleSubmit() :Promise<Boolean>{
    //Map medication from file format to our database format
    this.MapMedications();
    // Check the mapped data before displaying it in the table
    let isDrugChecked = await this.CheckDrugData();

    if (isDrugChecked) {
      //display the mapped data with their checks result
      //handle switch to next page and emits the events to parent
      this.displayDrugAfterCheck();
      return true;
    } else {
      // Handle the error appropriately
      console.error('Failed to check drug data');
      return false;
    }
  }

  displayDrugAfterCheck() {
    let isPartial = false;
    if (this.drugsChecked) {
      // We have this.drugsChecked filled with all the drugs checked by the backend,
      // Each drug has the correspendant (isDosageValid and IsDrugExist) properties containing the boolean type
      let mappedDataAfterCheck: MedicationType[] =
        this.drugsChecked.drugsChecked.map((dto) => {
          let isDosageValid = dto.isDosageValid?.valueOf() ?? false;
          let IsDrugExist = dto.isDrugExist?.valueOf() ?? false;
          if (!IsDrugExist || !isDosageValid) isPartial = true;

          return {
            Name: dto.name,
            Dosage: dto.dosage,
            Form: dto.form,
            Code: dto.code,
            Unit: dto.unit,
            Stock: dto.stock.toString(),
            AlertStock: dto.alertStock.toString(),
            AverageStock: dto.avrgStock.toString(),
            MinimumStock: dto.minStock.toString(),
            SafetyStock: dto.safetyStock.toString(),
            ExpiredAt: dto.expiredAt.toString(),
            Price: dto.stock.toString(),
            Description: dto.description,
            IsDosageValid: dto.isDosageValid?.valueOf(),
            IsDrugExist: dto.isDrugExist?.valueOf(),
          };
        });
      this.areAllCheckedDrugsValid.emit(isPartial);
      // If the check is successful, emit the event to display the data
      this.mappedDataAfterCheck = mappedDataAfterCheck;
      this.CheckedDrugsEvent.emit(mappedDataAfterCheck);
    } else {
      // Handle the error appropriately
      console.error("drugsChecked Variable isn't filled");
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
        AlertStock: '',
        AverageStock: '',
        MinimumStock: '',
        SafetyStock: '',
        ExpiredAt: '',
        Price: '',
        Description: '',
      };
      for (const dbHead of this.dbHeaders) {
        const oldHeader: string | undefined | boolean =
          this.columnMappings[dbHead as keyof MedicationType];
        if (oldHeader !== undefined && oldHeader !== undefined) {
          newMappedObject[dbHead as keyof MedicationType] =
            importedObj[oldHeader.toString()];
        } else {
          newMappedObject[dbHead as keyof MedicationType] = '';
        }
      }
      result.push(newMappedObject);
    }

    this.mappedDataBeforeCheck = result;
  }

  async CheckDrugData(
    mappedDataBeforeCheck: MedicationType[] = this.mappedDataBeforeCheck
  ): Promise<boolean> {
    let request: CheckDrugRequest | undefined;
    try {
      request= {
        drugs: mappedDataBeforeCheck.map((drug) => {
          return {
            name: drug.Name,
            dosage: drug.Dosage,
            form: drug.Form,
            code: drug.Code,
            unit: drug.Unit,
            description: drug.Description,
            expiredAt: tryParseDateOnlyFromExcel(drug.ExpiredAt,this.excelDateFormat),
            stock: tryParseInt(drug.Stock),
            alertStock: tryParseInt(drug.AlertStock),
            avrgStock: tryParseInt(drug.AverageStock),
            minStock: tryParseInt(drug.MinimumStock),
            safetyStock: tryParseInt(drug.SafetyStock),
            price: tryParseInt(drug.Price),
          };
        }),
      };
    } catch (error) {
      this.displayNewErrorMessage(error+"")

      console.error('Error in mapping data, types are incompatible:', error);
      return false;
    }
     
    console.log(request);
    try {
      let responseObservable = this.drugService.checkDrugs(request);
      let response: CheckDrugResponse = await firstValueFrom(
        responseObservable
      );
      console.log('Response from service:', response);
      this.drugsChecked = response;
      console.log('DrugsChecked set to:', this.drugsChecked);
      return true;
    } catch (error) {
      console.error('Error checking drug data:', error);
      return false;
    }
  }

  displayNewErrorMessage(
    content: string,
    duration = 4,
  ) {
    this.snackBarMessagesService.displaySnackBarMessage(content,snackbarMessageType.Error,duration,true)
  }

  onSelectchange(event: any, dbColumn: keyof MedicationType) {
    let areAllColumnsMapped=true;
    Object.values(this.columnMappings).forEach(column=>{
      if(column == "" || !column) areAllColumnsMapped=false;
    })
    this.onIsStep1PageValidChange.emit(areAllColumnsMapped);
  }
}

export type MedicationType = {
  Name: string;
  Dosage: string;
  Form: string;
  Code: string;
  Unit: string;
  Stock: string;
  AvailableStock?: string;
  ReservedStock?: string;
  AlertStock: string;
  AverageStock: string;
  MinimumStock: string;
  SafetyStock: string;
  ExpiredAt: string;
  Price: string;
  Description: string;
  IsDosageValid?: string | boolean;
  IsDrugExist?: string | boolean;
};

export function tryParseDateOnlyFromExcel(
  input: string | Date,
  excelDateFormat: string = 'dd-mm-yyyy'
): Date {
  debugger;
  try {
    if (input instanceof Date) {
      return input;
    }
    let inputParsed = '';
    if (typeof input == 'string') {
      inputParsed = input.replace(/--/g, '-');
    } else {
      throw new Error('Invalid date: ' + input);
    }

    try {
      let aTry=new Date(inputParsed)
      if (!isNaN(aTry.getTime())) {
        return aTry;
      }
    } catch (error) {
      //just continue
    }

    let [firstPart, secondPart, third] = inputParsed.split('-').map(Number);

    if (isNaN(third) || isNaN(firstPart) || isNaN(secondPart))
      throw new Error('Invalid date: ' + input);

    let mIndex = excelDateFormat.indexOf('mm');
    let yIndex = excelDateFormat.indexOf('yyyy');
    let dIndex = excelDateFormat.indexOf('dd');

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

    // Create a new Date object in UTC
    let result2 = new Date(Date.UTC(years, months - 1, days));

    if (isNaN(result2.getTime())) {
      throw new Error('Invalid date: ' + input);
    }
    return result2;
  } catch (error) {
    throw error;
  }
}

export function tryParseInt(input: string): number {
  let result = 0;
  try {
    result = parseInt(input);
  } catch (error) {}
  if (isNaN(result) || result == undefined || result == null)  throw new Error('Invalid Number : '+ input);
  return result;
}
