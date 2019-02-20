import { TestBed, inject } from '@angular/core/testing';
import { CalendrierHealthService } from './calendrier-health.service';
describe('CalendrierHealthService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [CalendrierHealthService]
        });
    });
    it('should be created', inject([CalendrierHealthService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=calendrier-health.service.spec.js.map