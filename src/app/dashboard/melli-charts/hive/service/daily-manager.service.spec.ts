import { TestBed } from '@angular/core/testing';

import { DailyManagerService } from './daily-manager.service';

describe('DailyManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DailyManagerService = TestBed.get(DailyManagerService);
    expect(service).toBeTruthy();
  });
});
