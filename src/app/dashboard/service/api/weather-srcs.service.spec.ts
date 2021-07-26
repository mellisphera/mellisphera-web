import { TestBed } from '@angular/core/testing';

import { WeatherSrcsService } from './weather-srcs.service';

describe('WeatherSrcsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherSrcsService = TestBed.get(WeatherSrcsService);
    expect(service).toBeTruthy();
  });
});
