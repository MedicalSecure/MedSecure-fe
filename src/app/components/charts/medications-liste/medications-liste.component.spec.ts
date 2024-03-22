import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationsListeComponent} from './medications-liste.component';

describe('BarWithMarkersComponent', () => {
  let component: MedicationsListeComponent;
  let fixture: ComponentFixture<MedicationsListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationsListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicationsListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
