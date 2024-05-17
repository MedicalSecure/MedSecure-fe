import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDataAzureComponent } from './get-data-azure.component';

describe('GetDataAzureComponent', () => {
  let component: GetDataAzureComponent;
  let fixture: ComponentFixture<GetDataAzureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetDataAzureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetDataAzureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
