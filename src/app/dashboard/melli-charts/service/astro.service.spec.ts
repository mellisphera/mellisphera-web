import { TestBed } from '@angular/core/testing';

import { AstroService } from './astro.service';

describe('AstroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AstroService = TestBed.get(AstroService);
    expect(service).toBeTruthy();
  });
});
