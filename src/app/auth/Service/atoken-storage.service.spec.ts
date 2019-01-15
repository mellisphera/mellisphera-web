import { TestBed, inject } from '@angular/core/testing';

import { AtokenStorageService } from './atoken-storage.service';

describe('AtokenStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AtokenStorageService]
    });
  });

  it('should be created', inject([AtokenStorageService], (service: AtokenStorageService) => {
    expect(service).toBeTruthy();
  }));
});
