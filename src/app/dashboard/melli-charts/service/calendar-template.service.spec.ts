import { TestBed, inject } from '@angular/core/testing';

import { CalendarTemplateService } from './calendar-template.service';

describe('CalendarTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarTemplateService]
    });
  });

  it('should be created', inject([CalendarTemplateService], (service: CalendarTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
