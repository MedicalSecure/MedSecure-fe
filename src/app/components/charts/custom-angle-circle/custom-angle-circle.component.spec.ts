import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAngleCircleComponent } from './custom-angle-circle.component';

describe('CustomAngleCircleComponent', () => {
  let component: CustomAngleCircleComponent;
  let fixture: ComponentFixture<CustomAngleCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAngleCircleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomAngleCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
