import { TestBed, inject } from '@angular/core/testing';

import { MelliChartsService } from './melli-charts.service';

describe('MelliChartsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MelliChartsService]
    });
  });

  it('should be created', inject([MelliChartsService], (service: MelliChartsService) => {
    expect(service).toBeTruthy();
  }));
});
