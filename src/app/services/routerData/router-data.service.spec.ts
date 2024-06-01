import { TestBed } from '@angular/core/testing';

import { RouterDataService } from './router-data.service';

describe('RouterDataService', () => {
  let service: RouterDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
