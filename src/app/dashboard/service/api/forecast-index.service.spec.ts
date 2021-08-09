import { TestBed } from '@angular/core/testing';

import { ForecastIndexService } from './forecast-index.service';

describe('ForecastIndexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForecastIndexService = TestBed.get(ForecastIndexService);
    expect(service).toBeTruthy();
  });
});
