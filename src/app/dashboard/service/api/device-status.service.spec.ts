import { TestBed } from '@angular/core/testing';

import { DeviceStatusService } from './device-status.service';

describe('DeviceStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceStatusService = TestBed.get(DeviceStatusService);
    expect(service).toBeTruthy();
  });
});
