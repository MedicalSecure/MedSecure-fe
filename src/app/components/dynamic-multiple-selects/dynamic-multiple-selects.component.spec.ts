import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMultipleSelectsComponent } from './dynamic-multiple-selects.component';

describe('DynamicMultipleSelectsComponent', () => {
  let component: DynamicMultipleSelectsComponent;
  let fixture: ComponentFixture<DynamicMultipleSelectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicMultipleSelectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicMultipleSelectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
