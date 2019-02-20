import { TestBed, inject } from '@angular/core/testing';
import { GraphRecordService } from './graph-record.service';
describe('GraphRecordService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [GraphRecordService]
        });
    });
    it('should be created', inject([GraphRecordService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=graph-record.service.spec.js.map