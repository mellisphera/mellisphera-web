import { TestBed, inject } from '@angular/core/testing';
import { RucheService } from './ruche.service';
describe('RucheService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [RucheService]
        });
    });
    it('should be created', inject([RucheService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=ruche.service.spec.js.map