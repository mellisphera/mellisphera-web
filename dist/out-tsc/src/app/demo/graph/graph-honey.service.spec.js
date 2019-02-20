import { TestBed, inject } from '@angular/core/testing';
import { GraphHoneyService } from './graph-honey.service';
describe('GraphHoneyService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [GraphHoneyService]
        });
    });
    it('should be created', inject([GraphHoneyService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=graph-honey.service.spec.js.map