import { TestBed, inject } from '@angular/core/testing';
import { DailyRecordsWService } from './daily-records-w.service';
describe('DailyRecordsWService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [DailyRecordsWService]
        });
    });
    it('should be created', inject([DailyRecordsWService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=daily-records-w.service.spec.js.map