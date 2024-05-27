import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonelsComponent } from './add-personels.component';

describe('AddPersonelsComponent', () => {
  let component: AddPersonelsComponent;
  let fixture: ComponentFixture<AddPersonelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPersonelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPersonelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
