import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorDataComponent } from './sensor-data.component';

describe('SensorDataComponent', () => {
  let component: SensorDataComponent;
  let fixture: ComponentFixture<SensorDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
