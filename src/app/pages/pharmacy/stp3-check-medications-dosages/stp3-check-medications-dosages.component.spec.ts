import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp3CheckMedicationsDosagesComponent } from './stp3-check-medications-dosages.component';

describe('Stp3CheckMedicationsDosagesComponent', () => {
  let component: Stp3CheckMedicationsDosagesComponent;
  let fixture: ComponentFixture<Stp3CheckMedicationsDosagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp3CheckMedicationsDosagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Stp3CheckMedicationsDosagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
