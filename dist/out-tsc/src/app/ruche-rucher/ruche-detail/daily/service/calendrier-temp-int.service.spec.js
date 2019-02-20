import { TestBed, inject } from '@angular/core/testing';
import { CalendrierTempIntService } from './calendrier-temp-int.service';
describe('CalendrierTempIntService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [CalendrierTempIntService]
        });
    });
    it('should be created', inject([CalendrierTempIntService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=calendrier-temp-int.service.spec.js.map