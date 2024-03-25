import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionWidgetComponent } from './prescription-widget.component';

describe('PrescriptionWidgetComponent', () => {
  let component: PrescriptionWidgetComponent;
  let fixture: ComponentFixture<PrescriptionWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescriptionWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
