import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationsInRuptureComponent } from './medications-in-rupture.component';

describe('MedicationsInRuptureComponent', () => {
  let component: MedicationsInRuptureComponent;
  let fixture: ComponentFixture<MedicationsInRuptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationsInRuptureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicationsInRuptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
