import { TestBed, inject } from '@angular/core/testing';

import { BmService } from './bm.service';

describe('BmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BmService]
    });
  });

  it('should be created', inject([BmService], (service: BmService) => {
    expect(service).toBeTruthy();
  }));
});
