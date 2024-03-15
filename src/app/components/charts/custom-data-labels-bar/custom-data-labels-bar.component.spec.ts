import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDataLabelsBarComponent } from './custom-data-labels-bar.component';

describe('CustomDataLabelsBarComponent', () => {
  let component: CustomDataLabelsBarComponent;
  let fixture: ComponentFixture<CustomDataLabelsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDataLabelsBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomDataLabelsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
