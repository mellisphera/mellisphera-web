import { TestBed, inject } from '@angular/core/testing';
import { GraphiqueFloraisonService } from './graphique-floraison.service';
describe('GraphiqueFloraisonService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [GraphiqueFloraisonService]
        });
    });
    it('should be created', inject([GraphiqueFloraisonService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=graphique-floraison.service.spec.js.map