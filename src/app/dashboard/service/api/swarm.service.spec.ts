import { TestBed } from '@angular/core/testing';

import { SwarmService } from './swarm.service';

describe('SwarmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwarmService = TestBed.get(SwarmService);
    expect(service).toBeTruthy();
  });
});
