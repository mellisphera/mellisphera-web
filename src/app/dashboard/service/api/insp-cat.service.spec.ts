import { TestBed } from '@angular/core/testing';

import { InspCatService } from './insp-cat.service';

describe('InspCatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InspCatService = TestBed.get(InspCatService);
    expect(service).toBeTruthy();
  });
});
