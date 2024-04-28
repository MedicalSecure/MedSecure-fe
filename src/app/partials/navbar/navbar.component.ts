import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { NgIf } from '@angular/common';
import * as XLSX from 'xlsx';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { ProfileType } from '../../pages/profile/ProfileType';
import { protectedResources } from '../../auth-config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
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
    MatSelectModule,
    MatOption,
    FormsModule,
    NavbarComponent,
  ],
})
export class NavbarComponent implements OnInit {
  profile: ProfileType | undefined;

  ngOnInit() {
    this.getProfile(protectedResources.apiConfig.uri);
  }

  getProfile(url: string) {
    this.http.get(url).subscribe((profile) => {
      this.profile = profile;
    });
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: MsalService
  ) {}

  loginDisplay = false;
  logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
      this.authService.logout();
    }
  }


  displayTabs: boolean = true;
  importedData: { [key: string]: any }[] = [];
  //after mapping :
  mappedData: MedicationType[] = [];
  importedDataHeaders: string[] = [];
  isImportValid: boolean = false;
  isShowImportModal = false;

  columnMappings: MedicationType = {
    Name: NOT_ASSIGNED,
    Dosage: NOT_ASSIGNED,
    Forme: NOT_ASSIGNED,
    DCI: NOT_ASSIGNED,
    'Expiration Date': NOT_ASSIGNED,
    Unit: NOT_ASSIGNED,
    Price: NOT_ASSIGNED,
    Stock: NOT_ASSIGNED,
    'Alert Stock': NOT_ASSIGNED,
    'Average Stock': NOT_ASSIGNED,
    'Minimum Stock': NOT_ASSIGNED,
    'Safety Stock': NOT_ASSIGNED,
  };
  dbHeaders: (keyof MedicationType)[] = Object.keys(
    this.columnMappings
  ) as (keyof MedicationType)[];

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
    let result: MedicationType[] = [];
    for (let importedObj of this.importedData) {
      const newMappedObject: MedicationType = {
        Name: NOT_ASSIGNED,
        Dosage: NOT_ASSIGNED,
        Forme: NOT_ASSIGNED,
        DCI: NOT_ASSIGNED,
        'Expiration Date': NOT_ASSIGNED,
        Unit: NOT_ASSIGNED,
        Price: NOT_ASSIGNED,
        Stock: NOT_ASSIGNED,
        'Alert Stock': NOT_ASSIGNED,
        'Average Stock': NOT_ASSIGNED,
        'Minimum Stock': NOT_ASSIGNED,
        'Safety Stock': NOT_ASSIGNED,
      };
      for (const dbHead of this.dbHeaders) {
        const oldHeader = this.columnMappings[dbHead as keyof MedicationType];
        if (importedObj[oldHeader] !== undefined) {
          newMappedObject[dbHead as keyof MedicationType] =
            importedObj[oldHeader];
        } else {
          newMappedObject[dbHead as keyof MedicationType] = NOT_ASSIGNED;
        }
      }
      result.push(newMappedObject);
    }
    this.mappedData = result;
    console.log('mappedData', this.mappedData);
    console.log('test', this.columnMappings);
    this.onClickCloseModal();
    this.router.navigate(['/', 'pharmacy'], { state: { mappedData: result } });
  }

  onClickCloseModal() {
    this.isShowImportModal = false;
  }

  stopPropagation($event: any) {
    $event.stopPropagation();
  }

  onSelectchange(event: any, dbColumn: keyof MedicationType) {
    this.columnMappings[dbColumn] = event.target.value;
    if (event.target.value == NOT_ASSIGNED) {
      this.columnMappings[dbColumn] = '';
    }
    console.log(this.columnMappings);
  }
}
export const NOT_ASSIGNED = '---';

export type MedicationType = {
  Name: string;
  Dosage: string;
  Forme: string;
  DCI: string;
  'Expiration Date': string;
  Unit: string;
  Price: string;
  Stock: string;
  'Alert Stock': string;
  'Average Stock': string;
  'Minimum Stock': string;
  'Safety Stock': string;
};
