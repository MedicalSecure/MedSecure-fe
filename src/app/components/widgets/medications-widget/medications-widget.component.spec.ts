import { ComponentFixture, TestBed } from '@angular/core/testing';

import {MedicationsWidgetComponent} from './medications-widget.component';

describe('MedicationsWidgetComponent', () => {
  let component: MedicationsWidgetComponent;
  let fixture: ComponentFixture<MedicationsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationsWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicationsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
