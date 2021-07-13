import { inject, TestBed } from '@angular/core/testing';

import { InspApiaryService } from './insp-apiary.service';

describe('InspApiaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [InspApiaryService]
  }));

  it('should be created', inject([InspApiaryService], (service: InspApiaryService) => {
    expect(service).toBeTruthy();
  }));
});
