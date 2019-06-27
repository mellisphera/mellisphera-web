import { TestBed } from '@angular/core/testing';

import { MelliChartsHiveService } from './melli-charts-hive.service';

describe('MelliChartsHiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MelliChartsHiveService = TestBed.get(MelliChartsHiveService);
    expect(service).toBeTruthy();
  });
});
