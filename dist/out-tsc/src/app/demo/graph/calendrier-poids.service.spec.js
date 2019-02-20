import { TestBed, inject } from '@angular/core/testing';
import { CalendrierFSTLervice } from './calendrierFSTL';
describe('CalendrierPoidsService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [CalendrierFSTLervice]
        });
    });
    it('should be created', inject([CalendrierFSTLervice], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=calendrier-poids.service.spec.js.map