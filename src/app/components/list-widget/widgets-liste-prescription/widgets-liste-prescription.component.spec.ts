import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsListePrescriptionComponent } from './widgets-liste-prescription.component';

describe('WidgetsListePrescriptionComponent', () => {
  let component: WidgetsListePrescriptionComponent;
  let fixture: ComponentFixture<WidgetsListePrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsListePrescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetsListePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
