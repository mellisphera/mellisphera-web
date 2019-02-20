import { TestBed, inject } from '@angular/core/testing';
import { UserloggedService } from './userlogged.service';
describe('UserloggedService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [UserloggedService]
        });
    });
    it('should be created', inject([UserloggedService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=userlogged.service.spec.js.map