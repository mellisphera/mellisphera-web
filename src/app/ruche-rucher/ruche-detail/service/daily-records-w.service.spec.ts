import { TestBed, inject } from '@angular/core/testing';

import { DailyRecordsWService } from './daily-records-w.service';

describe('DailyRecordsWService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DailyRecordsWService]
    });
  });

  it('should be created', inject([DailyRecordsWService], (service: DailyRecordsWService) => {
    expect(service).toBeTruthy();
  }));
});
