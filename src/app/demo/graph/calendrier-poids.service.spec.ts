import { TestBed, inject } from '@angular/core/testing';

import { CalendrierFSTLervice } from './calendrierFSTL';

describe('CalendrierPoidsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendrierFSTLervice]
    });
  });

  it('should be created', inject([CalendrierFSTLervice], (service: CalendrierFSTLervice) => {
    expect(service).toBeTruthy();
  }));
});
