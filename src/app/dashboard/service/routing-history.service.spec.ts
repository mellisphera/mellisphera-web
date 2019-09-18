import { TestBed } from '@angular/core/testing';

import { RoutingHistoryService } from './routing-history.service';

describe('RoutingHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutingHistoryService = TestBed.get(RoutingHistoryService);
    expect(service).toBeTruthy();
  });
});
