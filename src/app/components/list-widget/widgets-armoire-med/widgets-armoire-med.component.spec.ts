import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsArmoireMedComponent } from './widgets-armoire-med.component';

describe('WidgetsArmoireMedComponent', () => {
  let component: WidgetsArmoireMedComponent;
  let fixture: ComponentFixture<WidgetsArmoireMedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsArmoireMedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetsArmoireMedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
