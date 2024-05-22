import { TestBed } from '@angular/core/testing';

import { LeaveReportService } from './leave-report.service';

describe('LeaveReportService', () => {
  let service: LeaveReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
