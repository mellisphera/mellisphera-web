import { TestBed } from '@angular/core/testing';

import { MelliChartsFilterService } from './melli-charts-filter.service';

describe('MelliChartsFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MelliChartsFilterService = TestBed.get(MelliChartsFilterService);
    expect(service).toBeTruthy();
  });
});
