import { TestBed, inject } from '@angular/core/testing';
import { CalendrierPoidsService } from './calendrier-poids.service';
describe('CalendrierPoidsService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [CalendrierPoidsService]
        });
    });
    it('should be created', inject([CalendrierPoidsService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=calendrier-poids.service.spec.js.map