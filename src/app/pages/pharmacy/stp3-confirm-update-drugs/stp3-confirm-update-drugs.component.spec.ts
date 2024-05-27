import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp3ConfirmUpdateDrugs } from './stp3-confirm-update-drugs.component';

describe('Stp3ConfirmUpdateDrugs', () => {
  let component: Stp3ConfirmUpdateDrugs;
  let fixture: ComponentFixture<Stp3ConfirmUpdateDrugs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp3ConfirmUpdateDrugs]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Stp3ConfirmUpdateDrugs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
