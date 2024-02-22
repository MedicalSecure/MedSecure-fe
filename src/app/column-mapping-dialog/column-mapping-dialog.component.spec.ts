import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnMappingDialogComponent } from './column-mapping-dialog.component';

describe('ColumnMappingDialogComponent', () => {
  let component: ColumnMappingDialogComponent;
  let fixture: ComponentFixture<ColumnMappingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnMappingDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColumnMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
