import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CheckDrugRequest,
  CheckDrugResponse,
  CreateDrugRequest,
  CreateDrugResponse,
  DrugDTO,
  GetDrugsResponse,
} from '../../types/DrugDTOs';
import { Observable, map } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MedicationType } from '../../pages/pharmacy/stp1-import-map-drugs/stp1-import-map-drugs.component';
import { MatPaginator } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root',
})
export class DrugService {
  data_source: DrugDTO[] = [];

  private dataUrl = 'assets/data/MedicationData.json'; // Path to your JSON file

  getMedicationsNews(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
  getMedications(){
    return this.http.get<any>(this.dataUrl);
  constructor(private http: HttpClient) {}

  apiCheck = 'http://localhost:5008/api/v1/drugsChecked';

  apiCreate = 'http://localhost:5008/api/v1/drugs';

  getMedications() {
    return this.http.get<any>('./../../assets/data/medications.json');
  }

  checkDrugs(
    checkDrugRequest: CheckDrugRequest
  ): Observable<CheckDrugResponse> {
    console.log(JSON.stringify(checkDrugRequest));

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('accept', 'application/json');

    return this.http
      .post<CheckDrugResponse>(this.apiCheck, checkDrugRequest, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  postDrugs(drugDto: DrugDTO[]): Observable<CreateDrugResponse> {
    const postDrugRequest: CreateDrugRequest = {
      drugs: drugDto,
    };
    return this.http.post<CreateDrugResponse>(
      this.apiCreate,
      postDrugRequest);
  }

  getData(dataSource: MatTableDataSource<MedicationType, MatPaginator>) {
    this.http
      .get<GetDrugsResponse>('http://localhost:5008/api/v1/drugs')
      .subscribe(
        (response: GetDrugsResponse) => {
          if (response && response.drugs.data) {
            const medications = response.drugs.data.map(
              this.mapDrugDtoToMedicationType
            );
            dataSource.data = medications;
            this.data_source = response.drugs.data;

            medications.forEach((element) => {
              console.log(element);
            });
          } else {
            console.error('Invalid response format:', response);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  private mapDrugDtoToMedicationType(drug: DrugDTO): MedicationType {
    return {
      Name: drug.name,
      Dosage: drug.dosage,
      Form: drug.form,
      Code: drug.code,
      Unit: drug.unit,
      Stock: drug.stock.toString(),
      AvailableStock: drug.availableStock?.toString(),
      ReservedStock: drug.reservedStock?.toString(),
      AlertStock: drug.alertStock.toString(),
      AverageStock: drug.avrgStock.toString(),
      MinimumStock: drug.minStock.toString(),
      SafetyStock: drug.safetyStock.toString(),
      ExpiredAt: drug.expiredAt,
      Price: drug.price.toString(),
      Description: drug.description,
    };
  }
}
