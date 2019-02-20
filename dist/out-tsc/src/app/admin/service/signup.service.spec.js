import { TestBed, inject } from '@angular/core/testing';
import { SignupService } from './signup.service';
describe('SignupService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [SignupService]
        });
    });
    it('should be created', inject([SignupService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=signup.service.spec.js.map