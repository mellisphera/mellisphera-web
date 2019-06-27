import { TestBed } from '@angular/core/testing';

import { MelliChartsDateService } from '../service/melli-charts-date.service';

describe('MelliChartsDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MelliChartsDateService = TestBed.get(MelliChartsDateService);
    expect(service).toBeTruthy();
  });
});
