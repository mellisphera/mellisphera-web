import { TestBed, inject } from '@angular/core/testing';
import { ConnectionsMapService } from './connections-map.service';
describe('ConnectionsMapService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [ConnectionsMapService]
        });
    });
    it('should be created', inject([ConnectionsMapService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=connections-map.service.spec.js.map