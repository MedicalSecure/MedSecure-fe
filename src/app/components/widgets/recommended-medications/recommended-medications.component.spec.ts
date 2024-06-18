import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedMedicationsComponent } from './recommended-medications.component';

describe('RecommendedMedicationsComponent', () => {
  let component: RecommendedMedicationsComponent;
  let fixture: ComponentFixture<RecommendedMedicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedMedicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendedMedicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
