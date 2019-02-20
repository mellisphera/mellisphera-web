import { TestBed, inject } from '@angular/core/testing';
import { ObservationService } from './observation.service';
describe('ObservationService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [ObservationService]
        });
    });
    it('should be created', inject([ObservationService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=observation.service.spec.js.map