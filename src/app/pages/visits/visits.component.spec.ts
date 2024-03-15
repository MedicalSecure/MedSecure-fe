import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Visits } from './visits.component';

describe('Visits ', () => {
  let component: Visits;
  let fixture: ComponentFixture<Visits >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Visits ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Visits );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
