import { TestBed, inject } from '@angular/core/testing';
import { CalendrierService } from './calendrier.service';
describe('CalendrierService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [CalendrierService]
        });
    });
    it('should be created', inject([CalendrierService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=calendrier.service.spec.js.map