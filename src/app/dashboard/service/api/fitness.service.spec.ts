import { TestBed } from '@angular/core/testing';

import { FitnessService } from './fitness.service';

describe('FitnessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FitnessService = TestBed.get(FitnessService);
    expect(service).toBeTruthy();
  });
});
