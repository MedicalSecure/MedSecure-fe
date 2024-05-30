import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUrgencyCasesComponent } from './top-urgency-cases.component';

describe('TopUrgencyCasesComponent', () => {
  let component: TopUrgencyCasesComponent;
  let fixture: ComponentFixture<TopUrgencyCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopUrgencyCasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopUrgencyCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
