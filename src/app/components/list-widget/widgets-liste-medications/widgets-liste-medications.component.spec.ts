import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsListeMedicationsComponent } from './widgets-liste-medications.component';

describe('WidgetsListeMedicationsComponent', () => {
  let component: WidgetsListeMedicationsComponent;
  let fixture: ComponentFixture<WidgetsListeMedicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsListeMedicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetsListeMedicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
