import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialbarChartsComponent } from './radialbar-charts.component';

describe('RadialbarChartsComponent', () => {
  let component: RadialbarChartsComponent;
  let fixture: ComponentFixture<RadialbarChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadialbarChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadialbarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
