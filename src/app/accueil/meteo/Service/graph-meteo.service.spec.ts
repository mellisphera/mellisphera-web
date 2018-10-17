import { TestBed, inject } from '@angular/core/testing';

import { GraphMeteoService } from './graph-meteo.service';

describe('GraphMeteoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphMeteoService]
    });
  });

  it('should be created', inject([GraphMeteoService], (service: GraphMeteoService) => {
    expect(service).toBeTruthy();
  }));
});
