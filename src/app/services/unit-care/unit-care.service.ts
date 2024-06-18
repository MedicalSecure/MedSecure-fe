import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnitCare } from '../../model/unitcare'; // Assure-toi que le chemin vers ton modèle est correct
interface UnitCareResponse {
  unitCares: {
      pageIndex: number;
      pageSize: number;
      count: number;
      data: UnitCare[];
  };
}
@Injectable({
  providedIn: 'root'
})
export class UnitCareService {
  private readonly baseUrl = 'assets/data/unicare.json';

  constructor(private http: HttpClient) { }

  getUnitCares(): Observable<UnitCare[]> {
    return this.http.get<UnitCareResponse>(this.baseUrl).pipe(
        map(response => response.unitCares.data)
    );
}


  getActivatedUnitCares(): Observable<number> {
    return this.getUnitCares().pipe(
      map(unitCares => unitCares.filter(unitCare => unitCare.unitStatus === 2).length)
    );
  }
  getCountUnitCares():Observable<number> {
    return this.getUnitCares().pipe(
      map(unitCare => unitCare.length)
    );
  }
}


