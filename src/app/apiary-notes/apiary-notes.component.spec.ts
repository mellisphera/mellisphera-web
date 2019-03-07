import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiaryNotesComponent } from './apiary-notes.component';

describe('ApiaryNotesComponent', () => {
  let component: ApiaryNotesComponent;
  let fixture: ComponentFixture<ApiaryNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiaryNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiaryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
