import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

/* @Injectable()
export class MultiselectDataService {

  constructor() { }

  products: any[] = [
    { id: "p0", name: "AirWatch", numberOfCSs: 33, running: false },
    { id: "p1", name: "Horizon View", numberOfCSs: 175, running: false },
    { id: "p2", name: "Hyperic", numberOfCSs: 8, running: false },
    { id: "p3", name: "Log Insight", numberOfCSs: 128, running: false },
    { id: "p4", name: "NSX", numberOfCSs: 294, running: false },
    { id: "p5", name: "Pivotal", numberOfCSs: 8, running: false },
    { id: "p6", name: "SRM", numberOfCSs: 118, running: false },
    { id: "p7", name: "VIO", numberOfCSs: 12, running: false },
    { id: "p8", name: "Workspace One", numberOfCSs: 40, running: false },
    { id: "p9", name: "vCD", numberOfCSs: 33, running: false },
    { id: "p10", name: "vCloud Air", numberOfCSs: 19, running: false },
    { id: "p11", name: "vRA", numberOfCSs: 292, running: false },
    { id: "p12", name: "vRB", numberOfCSs: 107, running: false },
    { id: "p13", name: "vROPS", numberOfCSs: 281, running: false },
    { id: "p14", name: "vSAN", numberOfCSs: 95, running: false },
    { id: "p15", name: "vSphere", numberOfCSs: 427, running: false }
  ];

  industries: any[] = [
    { id: "industry0", name: "Construction", numberOfCSs: 1, running: false },
    { id: "industry1", name: "Energy", numberOfCSs: 3, running: false },
    { id: "industry2", name: "Federal", numberOfCSs: 12, running: false },
    { id: "industry3", name: "Financial Services", numberOfCSs: 6, running: false },
    { id: "industry4", name: "Healthcare", numberOfCSs: 1, running: false },
    { id: "industry5", name: "High Tech", numberOfCSs: 3, running: false },
    { id: "industry6", name: "Hotel and Restaurant", numberOfCSs: 5, running: false },
    { id: "industry7", name: "Manufacturing", numberOfCSs: 1, running: false },
    { id: "industry8", name: "Real Estate", numberOfCSs: 1, running: false },
    { id: "industry9", name: "Retail", numberOfCSs: 1, running: false },
    { id: "industry10", name: "Services", numberOfCSs: 1, running: false },
    { id: "industry11", name: "SLED", numberOfCSs: 1, running: false },
    { id: "industry12", name: "Telecommunications", numberOfCSs: 1, running: false },
    { id: "industry13", name: "Transportation", numberOfCSs: 1, running: false }
  ];

  regions: any[] = [
    { id: "reg0", itemName: 'CEMEA', name: "CEMEA", geo: 'EMEA', numberOfCSs: 3, running: false, child: { state: 'Active' } },
    { id: "reg1", itemName: 'NEMEA', name: "NEMEA", geo: 'EMEA', numberOfCSs: 3, running: false, child: { state: 'Active' } },
    { id: "reg2", itemName: 'EU/EFTA', name: "EU/EFTA", geo: 'EMEA', numberOfCSs: 3, running: false, child: { state: 'Active' } },
    { id: "reg3", itemName: 'APJ', name: "APJ", geo: 'APJ', numberOfCSs: 3, running: false, child: { state: 'Active' } },
    { id: "reg4", itemName: 'Americas', name: "Americas", geo: 'Americas', numberOfCSs: 3, running: false, child: { state: 'Active' } }
  ];

// { name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States', child: { state: 'Active' } },
// { name: 'Homer', email: 'homer@email.com', age: 47, country: '', child: { state: 'Active' } },
// { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States', child: { state: 'Active' } },
// { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina', child: { state: 'Active' } },
// { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina', child: { state: 'Active' } },

  public getProducts(): any[] {
    return this.products;
  }
  public getIndustries(): any[] {
    return this.industries;
  }
  public getRegions(): any[] {
    return this.regions;
  }

} */

export interface Person {
    id: string;
    isActive: boolean;
    age: number;
    name: string;
    gender: string;
    company: string;
    email: string;
    phone: string;
    disabled?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private http: HttpClient) { }

    getGithubAccounts(term: string = "") {
        if (term) {
            return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).pipe(map(rsp => rsp.items));
        } else {
            return of([]);
        }
    }

    getAlbums() {
        return this.http.get<any[]>('https://jsonplaceholder.typicode.com/albums');
    }

    getPhotos() {
        return this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos');
    }

    getPeople(term: string = ""): Observable<Person[]> {
        let items = getMockPeople();
        if (term) {
            items = items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }
}

function getMockPeople() {
    return [
        {
            'id': '5a15b13c36e7a7f00cf0d7cb',
            'index': 2,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 23,
            'name': 'Karyn Wright',
            'gender': 'female',
            'company': 'ZOLAR',
            'email': 'karynwright@zolar.com',
            'phone': '+1 (851) 583-2547'
        },
        {
            'id': '5a15b13c2340978ec3d2c0ea',
            'index': 3,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 35,
            'name': 'Rochelle Estes',
            'disabled': true,
            'gender': 'female',
            'company': 'EXTRAWEAR',
            'email': 'rochelleestes@extrawear.com',
            'phone': '+1 (849) 408-2029'
        },
        {
            'id': '5a15b13c663ea0af9ad0dae8',
            'index': 4,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 25,
            'name': 'Mendoza Ruiz',
            'gender': 'male',
            'company': 'ZYTRAX',
            'email': 'mendozaruiz@zytrax.com',
            'phone': '+1 (904) 536-2020'
        },
        {
            'id': '5a15b13cc9eeb36511d65acf',
            'index': 5,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 39,
            'name': 'Rosales Russell',
            'gender': 'male',
            'company': 'ELEMANTRA',
            'email': 'rosalesrussell@elemantra.com',
            'phone': '+1 (868) 473-3073'
        },
        {
            'id': '5a15b13c728cd3f43cc0fe8a',
            'index': 6,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 32,
            'name': 'Marquez Nolan',
            'gender': 'male',
            'company': 'MIRACLIS',
            'disabled': true,
            'email': 'marqueznolan@miraclis.com',
            'phone': '+1 (853) 571-3921'
        },
        {
            'id': '5a15b13ca51b0aaf8a99c05a',
            'index': 7,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 28,
            'name': 'Franklin James',
            'gender': 'male',
            'company': 'CAXT',
            'email': 'franklinjames@caxt.com',
            'phone': '+1 (868) 539-2984'
        },
        {
            'id': '5a15b13cc3b9381ffcb1d6f7',
            'index': 8,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 24,
            'name': 'Elsa Bradley',
            'gender': 'female',
            'company': 'MATRIXITY',
            'email': 'elsabradley@matrixity.com',
            'phone': '+1 (994) 583-3850'
        },
        {
            'id': '5a15b13ce58cb6ff62c65164',
            'index': 9,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 40,
            'name': 'Pearson Thompson',
            'gender': 'male',
            'company': 'EZENT',
            'email': 'pearsonthompson@ezent.com',
            'phone': '+1 (917) 537-2178'
        },
        {
            'id': '5a15b13c90b95eb68010c86e',
            'index': 10,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 32,
            'name': 'Ina Pugh',
            'gender': 'female',
            'company': 'MANTRIX',
            'email': 'inapugh@mantrix.com',
            'phone': '+1 (917) 450-2372'
        },
        {
            'id': '5a15b13c2b1746e12788711f',
            'index': 11,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 25,
            'name': 'Nguyen Elliott',
            'gender': 'male',
            'company': 'PORTALINE',
            'email': 'nguyenelliott@portaline.com',
            'phone': '+1 (905) 491-3377'
        },
        {
            'id': '5a15b13c605403381eec5019',
            'index': 12,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 31,
            'name': 'Mills Barnett',
            'gender': 'male',
            'company': 'FARMEX',
            'email': 'millsbarnett@farmex.com',
            'phone': '+1 (882) 462-3986'
        },
        {
            'id': '5a15b13c67e2e6d1a3cd6ca5',
            'index': 13,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 36,
            'name': 'Margaret Reynolds',
            'gender': 'female',
            'company': 'ROOFORIA',
            'email': 'margaretreynolds@rooforia.com',
            'phone': '+1 (935) 435-2345'
        },
        {
            'id': '5a15b13c947c836d177aa85c',
            'index': 14,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 29,
            'name': 'Yvette Navarro',
            'gender': 'female',
            'company': 'KINETICA',
            'email': 'yvettenavarro@kinetica.com',
            'phone': '+1 (807) 485-3824'
        },
        {
            'id': '5a15b13c5dbbe61245c1fb73',
            'index': 15,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 20,
            'name': 'Elisa Guzman',
            'gender': 'female',
            'company': 'KAGE',
            'email': 'elisaguzman@kage.com',
            'phone': '+1 (868) 594-2919'
        },
        {
            'id': '5a15b13c38fd49fefea8db80',
            'index': 16,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 33,
            'name': 'Jodie Bowman',
            'gender': 'female',
            'company': 'EMTRAC',
            'email': 'jodiebowman@emtrac.com',
            'phone': '+1 (891) 565-2560'
        },
        {
            'id': '5a15b13c9680913c470eb8fd',
            'index': 17,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 24,
            'name': 'Diann Booker',
            'gender': 'female',
            'company': 'LYRIA',
            'email': 'diannbooker@lyria.com',
            'phone': '+1 (830) 555-3209'
        }
    ]
}
