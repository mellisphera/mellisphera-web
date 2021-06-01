import { TestBed } from '@angular/core/testing';

import { InspUserService } from './insp-user.service';

describe('InspUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InspUserService = TestBed.get(InspUserService);
    expect(service).toBeTruthy();
  });
});
