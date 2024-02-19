import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Visite } from '../model/visite.model';

@Injectable({
  providedIn: 'root'
})
export class VisiteService {
  private apiUrl = '/assets/data/visits.json'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient) { }
  getAllVisits(): Observable<Visite[]> {
    return this.http.get<Visite[]>(this.apiUrl);
  }
  // Créer une visite
  createVisit(visit: Visite): Observable<Visite[]> {
    return this.getAllVisits().pipe(
      catchError(error => {
        console.error('Erreur lors de la lecture des visites :', error);
        return [];
      })
    );
  }

  // Autres méthodes du service...

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Une erreur s\'est produite :', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(`Code d'erreur du serveur : ${error.status}, ` +
        `message : ${error.error}`);
    }
    return throwError('Une erreur est survenue lors de la création de la visite. Veuillez réessayer.');
  }
}
