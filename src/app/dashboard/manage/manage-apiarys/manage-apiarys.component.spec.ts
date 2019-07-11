import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageApiarysComponent } from './manage-apiarys.component';

describe('ManageApiarysComponent', () => {
  let component: ManageApiarysComponent;
  let fixture: ComponentFixture<ManageApiarysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageApiarysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageApiarysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
