import { TestBed } from '@angular/core/testing';

import { CurrentIndexService } from './current-index.service';

describe('CurrentIndexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentIndexService = TestBed.get(CurrentIndexService);
    expect(service).toBeTruthy();
  });
});
