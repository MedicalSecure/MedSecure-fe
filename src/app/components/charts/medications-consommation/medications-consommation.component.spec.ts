import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationsConsommationComponent } from './medications-consommation.component';

describe('MedicationsConsommationComponent', () => {
  let component: MedicationsConsommationComponent;
  let fixture: ComponentFixture<MedicationsConsommationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationsConsommationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicationsConsommationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
