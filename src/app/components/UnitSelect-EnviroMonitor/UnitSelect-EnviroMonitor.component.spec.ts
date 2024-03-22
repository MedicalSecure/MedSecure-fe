import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSelectEnviroMonitorComponent } from './UnitSelect-EnviroMonitor.component';

describe('UnitSelectEnviroMonitorComponent', () => {
  let component: UnitSelectEnviroMonitorComponent;
  let fixture: ComponentFixture<UnitSelectEnviroMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitSelectEnviroMonitorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitSelectEnviroMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
