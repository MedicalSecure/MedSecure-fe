import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp2ViewCheckDrugs } from './stp2-view-check-drugs.component';

describe('Stp2ViewCheckDrugs', () => {
  let component: Stp2ViewCheckDrugs;
  let fixture: ComponentFixture<Stp2ViewCheckDrugs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp2ViewCheckDrugs]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Stp2ViewCheckDrugs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
