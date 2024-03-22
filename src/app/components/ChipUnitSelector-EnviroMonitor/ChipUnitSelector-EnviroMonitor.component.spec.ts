import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipUnitSelectorEnviroMonitor } from './ChipUnitSelector-EnviroMonitor.component';

describe('ChipUnitSelectorEnviroMonitor', () => {
  let component: ChipUnitSelectorEnviroMonitor;
  let fixture: ComponentFixture<ChipUnitSelectorEnviroMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipUnitSelectorEnviroMonitor]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChipUnitSelectorEnviroMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
