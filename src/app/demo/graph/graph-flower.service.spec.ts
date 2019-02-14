import { TestBed, inject } from '@angular/core/testing';

import { GraphFlowerService } from './graph-flower.service';

describe('GraphFlowerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphFlowerService]
    });
  });

  it('should be created', inject([GraphFlowerService], (service: GraphFlowerService) => {
    expect(service).toBeTruthy();
  }));
});
