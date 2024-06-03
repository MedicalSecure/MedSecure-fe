import { TestBed } from '@angular/core/testing';

import { PrescriptionApiService } from './prescription-api.service';

describe('PrescriptionService', () => {
  let service: PrescriptionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescriptionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
