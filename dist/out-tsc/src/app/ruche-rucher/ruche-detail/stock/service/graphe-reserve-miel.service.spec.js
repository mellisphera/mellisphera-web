import { TestBed, inject } from '@angular/core/testing';
import { GrapheReserveMielService } from './graphe-reserve-miel.service';
describe('GrapheReserveMielService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [GrapheReserveMielService]
        });
    });
    it('should be created', inject([GrapheReserveMielService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=graphe-reserve-miel.service.spec.js.map