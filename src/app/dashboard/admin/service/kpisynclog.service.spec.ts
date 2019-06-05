import { TestBed } from '@angular/core/testing';

import { KpisynclogService } from './kpisynclog.service';

describe('KpisynclogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KpisynclogService = TestBed.get(KpisynclogService);
    expect(service).toBeTruthy();
  });
});
