import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp1ImportMapDrugs } from './stp1-import-map-drugs.component';

describe('Stp1ImportMapDrugs', () => {
  let component: Stp1ImportMapDrugs;
  let fixture: ComponentFixture<Stp1ImportMapDrugs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp1ImportMapDrugs]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Stp1ImportMapDrugs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
