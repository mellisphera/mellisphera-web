import { TestBed, inject } from '@angular/core/testing';
import { LoginService } from './login.service';
describe('LoginService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [LoginService]
        });
    });
    it('should be created', inject([LoginService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=login.service.spec.js.map