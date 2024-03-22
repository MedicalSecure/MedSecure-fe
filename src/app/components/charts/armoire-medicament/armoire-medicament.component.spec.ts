import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmoireMedicamentComponent } from './armoire-medicament.component';

describe('ArmoireMedicamentComponent', () => {
  let component: ArmoireMedicamentComponent;
  let fixture: ComponentFixture<ArmoireMedicamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmoireMedicamentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmoireMedicamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
