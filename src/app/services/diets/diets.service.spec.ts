import { TestBed } from '@angular/core/testing';

import { DietsService } from './diets.service';

describe('DietsService', () => {
  let service: DietsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DietsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
