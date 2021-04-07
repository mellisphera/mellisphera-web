import { inject, TestBed } from '@angular/core/testing';

import { InspHiveService } from './insp-hive.service';

describe('InspHiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers:[InspHiveService]
  }));

  it('should be created', inject([InspHiveService], (service: InspHiveService) => {
    expect(service).toBeTruthy();
  }));
});
