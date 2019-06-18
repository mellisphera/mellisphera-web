import { TestBed } from '@angular/core/testing';

import { MyNotifierService } from './my-notifier.service';

describe('MyNotifierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyNotifierService = TestBed.get(MyNotifierService);
    expect(service).toBeTruthy();
  });
});
