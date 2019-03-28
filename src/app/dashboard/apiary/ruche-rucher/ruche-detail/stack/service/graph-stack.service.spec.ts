import { TestBed, inject } from '@angular/core/testing';

import { GraphStackService } from './graph-stack.service';

describe('GraphStackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphStackService]
    });
  });

  it('should be created', inject([GraphStackService], (service: GraphStackService) => {
    expect(service).toBeTruthy();
  }));
});
