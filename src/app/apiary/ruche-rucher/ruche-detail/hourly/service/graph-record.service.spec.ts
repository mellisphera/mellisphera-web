import { TestBed, inject } from '@angular/core/testing';

import { GraphRecordService } from './graph-record.service';

describe('GraphRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphRecordService]
    });
  });

  it('should be created', inject([GraphRecordService], (service: GraphRecordService) => {
    expect(service).toBeTruthy();
  }));
});
