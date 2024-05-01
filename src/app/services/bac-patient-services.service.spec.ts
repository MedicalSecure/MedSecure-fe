import { TestBed } from '@angular/core/testing';

import { BacPatientServicesService } from './bac-patient-services.service';

describe('BacPatientServicesService', () => {
  let service: BacPatientServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BacPatientServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
