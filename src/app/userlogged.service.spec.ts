import { TestBed, inject } from '@angular/core/testing';

import { UserloggedService } from './userlogged.service';

describe('UserloggedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserloggedService]
    });
  });

  it('should be created', inject([UserloggedService], (service: UserloggedService) => {
    expect(service).toBeTruthy();
  }));
});
