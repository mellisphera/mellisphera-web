import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorAlertComponent } from './sensor-alert.component';

describe('SensorAlertComponent', () => {
  let component: SensorAlertComponent;
  let fixture: ComponentFixture<SensorAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
