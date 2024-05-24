import { TestBed } from '@angular/core/testing';

import { BacPatientService } from './bac-patient-services.service';

describe('BacPatientServicesService', () => {
  let service: BacPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BacPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
