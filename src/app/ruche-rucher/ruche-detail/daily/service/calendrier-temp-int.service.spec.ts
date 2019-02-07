import { TestBed, inject } from '@angular/core/testing';

import { CalendrierTempIntService } from './calendrier-temp-int.service';

describe('CalendrierTempIntService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendrierTempIntService]
    });
  });

  it('should be created', inject([CalendrierTempIntService], (service: CalendrierTempIntService) => {
    expect(service).toBeTruthy();
  }));
});
