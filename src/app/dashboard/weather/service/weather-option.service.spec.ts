import { TestBed } from '@angular/core/testing';

import { WeatherOptionService } from './weather-option.service';

describe('WeatherOptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherOptionService = TestBed.get(WeatherOptionService);
    expect(service).toBeTruthy();
  });
});
