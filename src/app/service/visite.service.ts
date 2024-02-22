import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Visite } from '../model/visite.model';

@Injectable({
  providedIn: 'root'
})
export class VisiteService {
  private apiUrl = '/assets/data/visits.json';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les visites
  getAllVisits(): Observable<Visite[]> {
    return this.http.get<Visite[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Créer une visite
  createVisit(visit: Visite): Observable<Visite> {
    return this.http.post<Visite>(this.apiUrl, visit).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour une visite
  updateVisit(visit: Visite): Observable<Visite> {
    const url = `${this.apiUrl}/${visit.id}`;
    return this.http.put<Visite>(url, visit).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer une visite
  deleteVisit(visitId: number): Observable<void> {
    const url = `${this.apiUrl}/${visitId}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Une erreur s\'est produite :', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(`Code d'erreur du serveur : ${error.status}, ` +
        `message : ${error.error}`);
    }
    return throwError('Une erreur est survenue. Veuillez réessayer plus tard.');
  }
}
