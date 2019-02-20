import { TestBed, inject } from '@angular/core/testing';

import { GraphiqueFloraisonService } from './graphique-floraison.service';

describe('GraphiqueFloraisonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphiqueFloraisonService]
    });
  });

  it('should be created', inject([GraphiqueFloraisonService], (service: GraphiqueFloraisonService) => {
    expect(service).toBeTruthy();
  }));
});
