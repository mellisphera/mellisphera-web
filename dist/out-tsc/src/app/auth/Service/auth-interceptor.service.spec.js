import { TestBed, inject } from '@angular/core/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
describe('AuthInterceptorService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [AuthInterceptorService]
        });
    });
    it('should be created', inject([AuthInterceptorService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=auth-interceptor.service.spec.js.map