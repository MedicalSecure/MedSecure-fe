
import { MsalService } from '@azure/msal-angular';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AzureGraphService {
  private apiUrl = 'https://graph.microsoft.com/v1.0/';

  constructor(private authService: MsalService, private http: HttpClient) { }

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

  async createUser(createUserRequest: any): Promise<any> {
    const createUserEndpoint = 'https://graph.microsoft.com/v1.0/users';
    const createUserScope = 'User.ReadWrite.All'; // Ensure this scope is included in your MSAL configuration
    const accessToken = await this.acquireToken(createUserScope);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });

    console.log('Creating user at:', createUserEndpoint);
    return this.http.post(createUserEndpoint, createUserRequest, { headers }).toPromise();
  }

  async inviteUserAsMember(inviteUserRequest: any): Promise<any> {
    const inviteUserEndpoint = 'https://graph.microsoft.com/v1.0/invitations';
    const inviteUserScope = 'User.Invite.All';
    const accessToken = await this.acquireToken(inviteUserScope);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });

    console.log('Inviting user at:', inviteUserEndpoint);
    return this.http.post(inviteUserEndpoint, inviteUserRequest, { headers }).toPromise();
  }

  async getUserById(userId: string): Promise<any> {
    const getUserEndpoint = `https://graph.microsoft.com/v1.0/users/${userId}`;
    const getUserByIdScope = 'User.ReadWrite.All'; // Change scope if necessary
    const accessToken = await this.acquireToken(getUserByIdScope);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });

    console.log('Fetching user details:', getUserEndpoint);
    return this.http.get(getUserEndpoint, { headers }).toPromise();
  }


  async addCustomExtension(userId: string, value: any, extensionName : string): Promise<void> {
    try {
      const getUserScope = 'User.ReadWrite.All'; // Change scope if necessary
      const accessToken = await this.acquireToken(getUserScope);

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      // Define the extension data
      const extensionData = {
        extensionName: extensionName, // Without GUID
        customValue: value,
      };

      // Make a POST request to add the extension
      const endpoint = `https://graph.microsoft.com/v1.0/users/${userId}/extensions`;
      await this.http.post(endpoint, extensionData, { headers }).toPromise();
    } catch (error) {
      console.error('Error adding custom extension:', error);
      throw error;
    }
  }

  async getExtension(userId: string, extensionName: string): Promise<any> {
    try {
      const getExtensionScope = 'User.ReadWrite.All'; // Change scope if necessary
      const accessToken = await this.acquireToken(getExtensionScope);
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      // Make a GET request to retrieve the extension data
      const endpoint = `https://graph.microsoft.com/v1.0/users/${userId}/extensions/${extensionName}`;
      return this.http.get(endpoint, { headers }).toPromise();
    } catch (error) {
      console.error('Error fetching extension:', error);
      throw error;
    }
  }

  getUsers(): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.acquireToken('User.ReadWrite.All').then(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const url = `${this.apiUrl}/users`;
        this.http.get<any[]>(url, { headers }).subscribe(
          (response) => observer.next(response),
          (error) => observer.error(error),
          () => observer.complete()
        );
      }).catch(error => {
        observer.error(error);
      });
    });
  }

}
