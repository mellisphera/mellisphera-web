import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSensorsComponent } from './manage-sensors.component';

describe('ManageSensorsComponent', () => {
  let component: ManageSensorsComponent;
  let fixture: ComponentFixture<ManageSensorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSensorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
