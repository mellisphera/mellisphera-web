import { TestBed } from '@angular/core/testing';

import { GeonamesService } from './geonames.service';

describe('GeonamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeonamesService = TestBed.get(GeonamesService);
    expect(service).toBeTruthy();
  });
});
