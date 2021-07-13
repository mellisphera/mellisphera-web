import { TestBed } from '@angular/core/testing';

import { InspectionService } from './inspection.service';

describe('InspectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InspectionService = TestBed.get(InspectionService);
    expect(service).toBeTruthy();
  });
});
