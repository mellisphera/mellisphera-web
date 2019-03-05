import { TestBed, inject } from '@angular/core/testing';

import { StackApiaryGraphService } from './stack-apiary-graph.service';

describe('StackApiaryGraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StackApiaryGraphService]
    });
  });

  it('should be created', inject([StackApiaryGraphService], (service: StackApiaryGraphService) => {
    expect(service).toBeTruthy();
  }));
});
