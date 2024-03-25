import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsWidgetComponent } from './patients-widget.component';

describe('PatientsWidgetComponent', () => {
  let component: PatientsWidgetComponent;
  let fixture: ComponentFixture<PatientsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
