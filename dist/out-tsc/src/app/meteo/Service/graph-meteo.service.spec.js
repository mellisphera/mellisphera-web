import { TestBed, inject } from '@angular/core/testing';
import { GraphMeteoService } from './graph-meteo.service';
describe('GraphMeteoService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [GraphMeteoService]
        });
    });
    it('should be created', inject([GraphMeteoService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=graph-meteo.service.spec.js.map