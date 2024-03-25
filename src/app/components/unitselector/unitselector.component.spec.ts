import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSelectorComponent } from './unitselector.component';

describe('UnitSelectorComponent', () => {
  let component:UnitSelectorComponent;
  let fixture: ComponentFixture<UnitSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
