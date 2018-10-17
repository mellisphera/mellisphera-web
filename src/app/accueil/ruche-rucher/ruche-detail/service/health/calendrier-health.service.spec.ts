import { TestBed, inject } from '@angular/core/testing';

import { CalendrierHealthService } from './calendrier-health.service';

describe('CalendrierHealthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendrierHealthService]
    });
  });

  it('should be created', inject([CalendrierHealthService], (service: CalendrierHealthService) => {
    expect(service).toBeTruthy();
  }));
});
