import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHivesComponent } from './manage-hives.component';

describe('ManageHivesComponent', () => {
  let component: ManageHivesComponent;
  let fixture: ComponentFixture<ManageHivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageHivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
