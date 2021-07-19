import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherRecordsComponent } from './weather-records.component';

describe('WeatherRecordsComponent', () => {
  let component: WeatherRecordsComponent;
  let fixture: ComponentFixture<WeatherRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
