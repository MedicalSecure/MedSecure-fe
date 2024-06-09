import { TestBed } from '@angular/core/testing';

import { UnitCareService } from './unit-care.service';

describe('UnitCareService', () => {
  let service: UnitCareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitCareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
