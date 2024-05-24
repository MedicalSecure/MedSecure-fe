import { TestBed } from '@angular/core/testing';

import { SupervisorDashboardService } from './supervisor-dashboard.service';

describe('SupervisorDashboardService', () => {
  let service: SupervisorDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupervisorDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
