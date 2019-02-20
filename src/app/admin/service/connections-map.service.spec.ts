import { TestBed, inject } from '@angular/core/testing';

import { ConnectionsMapService } from './connections-map.service';

describe('ConnectionsMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectionsMapService]
    });
  });

  it('should be created', inject([ConnectionsMapService], (service: ConnectionsMapService) => {
    expect(service).toBeTruthy();
  }));
});
