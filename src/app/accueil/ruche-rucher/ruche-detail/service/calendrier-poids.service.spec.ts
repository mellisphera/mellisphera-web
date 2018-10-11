import { TestBed, inject } from '@angular/core/testing';

import { CalendrierPoidsService } from './calendrier-poids.service';

describe('CalendrierPoidsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendrierPoidsService]
    });
  });

  it('should be created', inject([CalendrierPoidsService], (service: CalendrierPoidsService) => {
    expect(service).toBeTruthy();
  }));
});
