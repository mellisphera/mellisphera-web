import { TestBed, inject } from '@angular/core/testing';

import { GrapheReserveMielService } from './graphe-reserve-miel.service';

describe('GrapheReserveMielService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrapheReserveMielService]
    });
  });

  it('should be created', inject([GrapheReserveMielService], (service: GrapheReserveMielService) => {
    expect(service).toBeTruthy();
  }));
});
