import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSortingExample } from './table-sorting-example.component';

describe('TableSortingExampleComponent', () => {
  let component: TableSortingExample;
  let fixture: ComponentFixture<TableSortingExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSortingExample]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableSortingExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
