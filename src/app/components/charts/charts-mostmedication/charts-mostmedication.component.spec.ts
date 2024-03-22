import { ComponentFixture, TestBed } from '@angular/core/testing';

import { chartsmostmedicationComponent } from './charts-mostmedication.component';

describe('ColumnChartsComponent', () => {
  let component: chartsmostmedicationComponent;
  let fixture: ComponentFixture<chartsmostmedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [chartsmostmedicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(chartsmostmedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
