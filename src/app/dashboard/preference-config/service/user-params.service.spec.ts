import { TestBed, inject } from '@angular/core/testing';

import { UserParamsService } from './user-params.service';

describe('UserParamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserParamsService]
    });
  });

  it('should be created', inject([UserParamsService], (service: UserParamsService) => {
    expect(service).toBeTruthy();
  }));
});
