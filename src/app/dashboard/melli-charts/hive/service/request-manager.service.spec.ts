import { TestBed } from '@angular/core/testing';

import { RequestManagerService } from './request-manager.service';

describe('RequestManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestManagerService = TestBed.get(RequestManagerService);
    expect(service).toBeTruthy();
  });
});
