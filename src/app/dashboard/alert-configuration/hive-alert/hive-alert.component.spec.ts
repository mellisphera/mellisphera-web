import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiveAlertComponent } from './hive-alert.component';

describe('HiveAlertComponent', () => {
  let component: HiveAlertComponent;
  let fixture: ComponentFixture<HiveAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiveAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiveAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
