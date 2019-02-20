import { TestBed, inject } from '@angular/core/testing';
import { GraphFlowerService } from './graph-flower.service';
describe('GraphFlowerService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [GraphFlowerService]
        });
    });
    it('should be created', inject([GraphFlowerService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=graph-flower.service.spec.js.map