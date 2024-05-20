
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Presecription } from '../../model/Presecription'; // Assure-toi que le chemin vers ton modèle est correct

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private readonly baseUrl = 'assets/data/prescriptions.json';

  constructor(private http: HttpClient) { }

  getPrescriptions(): Observable<Presecription[]> {
    return this.http.get<Presecription[]>(this.baseUrl);
  }


  getValidePrescriptions(): Observable<number> {
    return this.getPrescriptions().pipe(
      map(presecription => presecription.filter(presecription => presecription.status === 'valide').length)
    );
  }
  getInValidePrescriptions(): Observable<number> {
    return this.getPrescriptions().pipe(
      map(presecription => presecription.filter(presecription => presecription.status === 'invalide').length)
    );
  }

  getCountPrescriptions():Observable<number> {
    return this.getPrescriptions().pipe(
      map(prescription => prescription.length)
    );
  }

  getPatientPrescribed(): Observable<number> {
    return this.getPrescriptions().pipe(
      map(prescriptions => {
        // Extract patient names and filter out any undefined or null values
        const patientNames = prescriptions
          .map(prescription => prescription.patient_name)
          .filter(name => name != null);
  
        // Create a Set to store unique patient names
        const uniquePatientNames = new Set(patientNames);
  
        // Return the number of unique patient names
        return uniquePatientNames.size;}))}

  
}