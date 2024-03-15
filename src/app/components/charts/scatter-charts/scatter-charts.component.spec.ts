import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterChartsComponent } from './scatter-charts.component';

describe('ScatterChartsComponent', () => {
  let component: ScatterChartsComponent;
  let fixture: ComponentFixture<ScatterChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScatterChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScatterChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
