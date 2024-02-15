import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitCareDialogComponent } from './add-unit-care-dialog.component';


describe('AddUnitCareDialogComponent', () => {
  let component: AddUnitCareDialogComponent;
  let fixture: ComponentFixture<AddUnitCareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUnitCareDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUnitCareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
