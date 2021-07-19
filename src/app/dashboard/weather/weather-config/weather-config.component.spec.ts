import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherConfigComponent } from './weather-config.component';

describe('WeatherConfigComponent', () => {
  let component: WeatherConfigComponent;
  let fixture: ComponentFixture<WeatherConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
