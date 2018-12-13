import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionRucherComponent } from './selection-rucher.component';

describe('SelectionRucherComponent', () => {
  let component: SelectionRucherComponent;
  let fixture: ComponentFixture<SelectionRucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionRucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionRucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
