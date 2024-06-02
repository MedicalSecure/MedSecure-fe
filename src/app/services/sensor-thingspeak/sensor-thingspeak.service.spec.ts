import { TestBed } from '@angular/core/testing';

import { SensorThingspeakService } from './sensor-thingspeak.service';

describe('SensorThingspeakService', () => {
  let service: SensorThingspeakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorThingspeakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
