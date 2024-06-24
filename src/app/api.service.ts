import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { protectedResources } from './auth-config';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private authService: MsalService, private http: HttpClient) {}

  // Function to acquire access token for a specific scope
  private acquireToken(scope: string): Promise<string> {
    return this.authService.acquireTokenSilent({
      scopes: [scope]
    }).toPromise()
      .then((response) => {
        if (response && response.accessToken) {
          return response.accessToken;
        } else {
          throw new Error('Access token not found in response');
        }
      })
      .catch((error) => {
        console.error('Error acquiring access token:', error);
        throw error;
      });
  }

  // Helper function to make authenticated HTTP GET request to a protected API endpoint
  private async getAuthenticatedRequest(endpoint: string, scope: string): Promise<any> {
    const accessToken = await this.acquireToken(scope);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    console.log('Making authenticated request to:', endpoint);
    return this.http.get(endpoint, { headers }).toPromise();
  }

  // Function to fetch patients data
getPatients(): Promise<any> {
  // Extracting endpoint and scope from protectedResources for patientsApi
  const patientsEndpoint = protectedResources.diet.patientsApi.endpoint;
  const patientsScope = protectedResources.diet.scopes.read[0];
  
  // Logging the endpoint from which patients data is fetched
  console.log('Fetching patients from:', patientsEndpoint);
  
  // Returning a promise for fetching patients data with authenticated request
  return this.getAuthenticatedRequest(patientsEndpoint, patientsScope);
}

// Function to fetch diets data
getDiets(): Promise<any> {
  // Extracting endpoint and scope from protectedResources for dietsApi
  const dietsEndpoint = protectedResources.diet.dietsApi.endpoint;
  const dietsScope = protectedResources.diet.scopes.read[0];
  
  // Logging the endpoint from which diets data is fetched
  console.log('Fetching diets from:', dietsEndpoint);
  
  // Returning a promise for fetching diets data with authenticated request
  return this.getAuthenticatedRequest(dietsEndpoint, dietsScope);
}

}