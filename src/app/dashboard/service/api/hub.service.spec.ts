import { TestBed } from '@angular/core/testing';

import { HubService } from './hub.service';

describe('HubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HubService = TestBed.get(HubService);
    expect(service).toBeTruthy();
  });
});
