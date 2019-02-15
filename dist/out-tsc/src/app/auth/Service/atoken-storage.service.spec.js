import { TestBed, inject } from '@angular/core/testing';
import { AtokenStorageService } from './atoken-storage.service';
describe('AtokenStorageService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [AtokenStorageService]
        });
    });
    it('should be created', inject([AtokenStorageService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=atoken-storage.service.spec.js.map