import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsHiveComponent } from './alerts-hive.component';

describe('AlertsHiveComponent', () => {
  let component: AlertsHiveComponent;
  let fixture: ComponentFixture<AlertsHiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsHiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsHiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
