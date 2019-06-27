import { TestBed } from '@angular/core/testing';

import { HourlyManagerService } from './hourly-manager.service';

describe('HourlyManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HourlyManagerService = TestBed.get(HourlyManagerService);
    expect(service).toBeTruthy();
  });
});
