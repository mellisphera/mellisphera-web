import { TestBed, inject } from '@angular/core/testing';
import { ConnectionService } from './connection.service';
describe('ConnectionService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [ConnectionService]
        });
    });
    it('should be created', inject([ConnectionService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=connection.service.spec.js.map