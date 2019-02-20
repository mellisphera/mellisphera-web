import { TestBed, inject } from '@angular/core/testing';
import { DailyStockHoneyService } from './daily-stock-honey.service';
describe('DailyStockHoneyService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [DailyStockHoneyService]
        });
    });
    it('should be created', inject([DailyStockHoneyService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=daily-stock-honey.service.spec.js.map