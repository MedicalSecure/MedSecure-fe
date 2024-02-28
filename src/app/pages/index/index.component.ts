import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MedicinesTableComponent } from '../../medicines-table/medicines-table.component';
import { NgIf } from '@angular/common';
import { CommunicationService } from '../../Services/communication-service.service';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'app-index',
    standalone: true,
    templateUrl: './index.component.html',
    styleUrl: './index.component.css',
    providers: [provideNativeDateAdapter()],
    imports: [RouterModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MedicinesTableComponent,NgIf],
})
export class IndexComponent {
  
  @ViewChild(MedicinesTableComponent)
  medicinesTableComponent!: MedicinesTableComponent;

  data: any[] = [];

  constructor(private communicationService: CommunicationService) { 
    
  }

  exportToXlsx() {
    this.communicationService.triggerExportToXlsx();
  }

  

  importExcelData(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0];
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result as string;
        this.communicationService.storedata(data);
        console.log(data);
      };
      reader.readAsBinaryString(file);
    }
  }

}

  
  


