import { TestBed } from '@angular/core/testing';

import { WeatherDateService } from './weather-date.service';

describe('WeatherDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherDateService = TestBed.get(WeatherDateService);
    expect(service).toBeTruthy();
  });
});
