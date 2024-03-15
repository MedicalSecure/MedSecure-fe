import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationSearchComponent } from './medication-search.component';

describe('MedicationSearchComponent', () => {
  let component: MedicationSearchComponent;
  let fixture: ComponentFixture<MedicationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
