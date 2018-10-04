import { TestBed, inject } from '@angular/core/testing';

import { CalendrierService } from './calendrier.service';

describe('CalendrierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendrierService]
    });
  });

  it('should be created', inject([CalendrierService], (service: CalendrierService) => {
    expect(service).toBeTruthy();
  }));
});
