import { TestBed, inject } from '@angular/core/testing';
import { RecordService } from './record.service';
describe('RecordService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [RecordService]
        });
    });
    it('should be created', inject([RecordService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=record.service.spec.js.map