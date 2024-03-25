import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSelectorWidget } from './unitselector-widget.component';

describe('UnitSelectorWidget', () => {
  let component: UnitSelectorWidget;
  let fixture: ComponentFixture<UnitSelectorWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitSelectorWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitSelectorWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
