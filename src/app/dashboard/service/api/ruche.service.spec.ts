import { TestBed, inject } from '@angular/core/testing';

import { RucheService } from './ruche.service';

describe('RucheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RucheService]
    });
  });

  it('should be created', inject([RucheService], (service: RucheService) => {
    expect(service).toBeTruthy();
  }));
});
