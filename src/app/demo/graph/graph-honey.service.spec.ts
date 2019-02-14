import { TestBed, inject } from '@angular/core/testing';

import { GraphHoneyService } from './graph-honey.service';

describe('GraphHoneyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphHoneyService]
    });
  });

  it('should be created', inject([GraphHoneyService], (service: GraphHoneyService) => {
    expect(service).toBeTruthy();
  }));
});
