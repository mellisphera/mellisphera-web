import { TestBed, inject } from '@angular/core/testing';

import { DailyStockHoneyService } from './daily-stock-honey.service';

describe('DailyStockHoneyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DailyStockHoneyService]
    });
  });

  it('should be created', inject([DailyStockHoneyService], (service: DailyStockHoneyService) => {
    expect(service).toBeTruthy();
  }));
});
