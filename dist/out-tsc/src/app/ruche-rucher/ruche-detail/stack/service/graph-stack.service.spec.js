import { TestBed, inject } from '@angular/core/testing';
import { GraphStackService } from './graph-stack.service';
describe('GraphStackService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [GraphStackService]
        });
    });
    it('should be created', inject([GraphStackService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=graph-stack.service.spec.js.map