import { TestBed } from '@angular/core/testing';

import { SeasonsService } from './seasons.service';

describe('SeasonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeasonsService = TestBed.get(SeasonsService);
    expect(service).toBeTruthy();
  });
});
