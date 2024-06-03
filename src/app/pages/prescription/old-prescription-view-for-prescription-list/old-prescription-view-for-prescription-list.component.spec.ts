import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldPrescriptionViewForPrescriptionListComponent } from './old-prescription-view-for-prescription-list.component';

describe('OldPrescriptionViewForPrescriptionListComponent', () => {
  let component: OldPrescriptionViewForPrescriptionListComponent;
  let fixture: ComponentFixture<OldPrescriptionViewForPrescriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldPrescriptionViewForPrescriptionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OldPrescriptionViewForPrescriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
