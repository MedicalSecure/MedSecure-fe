import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMedecineComponent } from './widget-medecine.component';

describe('WidgetMedecineComponent', () => {
  let component: WidgetMedecineComponent;
  let fixture: ComponentFixture<WidgetMedecineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetMedecineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetMedecineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
