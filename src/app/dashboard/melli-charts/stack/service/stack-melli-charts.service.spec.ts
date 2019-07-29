import { TestBed } from '@angular/core/testing';

import { StackMelliChartsService } from './stack-melli-charts.service';

describe('StackMelliChartsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StackMelliChartsService = TestBed.get(StackMelliChartsService);
    expect(service).toBeTruthy();
  });
});
