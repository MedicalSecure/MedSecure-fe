import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnChartsComponent } from './column-charts.component';

describe('ColumnChartsComponent', () => {
  let component: ColumnChartsComponent;
  let fixture: ComponentFixture<ColumnChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColumnChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
