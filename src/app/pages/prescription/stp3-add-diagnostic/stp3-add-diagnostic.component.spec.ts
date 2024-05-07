import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSymptomsComponent } from './stp3-add-diagnostic.component';

describe('AddSymptomsComponent', () => {
  let component: AddSymptomsComponent;
  let fixture: ComponentFixture<AddSymptomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSymptomsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSymptomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
