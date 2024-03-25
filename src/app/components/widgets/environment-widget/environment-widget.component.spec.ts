import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentWidget } from './environment-widget.component';

describe('EnvironmentWidget', () => {
  let component: EnvironmentWidget;
  let fixture: ComponentFixture<EnvironmentWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnvironmentWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
