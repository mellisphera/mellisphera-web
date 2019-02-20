"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var FileUploader_class_1 = require("./FileUploader.class");
describe('FileUploader', function () {
    it('inits', function () {
        expect(FileUploader_class_1.FileUploader).not.toBeNull();
        expect(new FileUploader_class_1.FileUploader()).not.toBeNull();
    });
    it('.png,.jpeg,.gif', function () {
        var options = { accept: '.png,.jpeg,.gif' };
        var fU = new FileUploader_class_1.FileUploader(options);
        expect(fU.acceptType('text/comma-separated-values')).toBe(false);
        expect(fU.acceptType('image/jpeg')).toBe(true);
        expect(fU.acceptType('image/gif')).toBe(true);
        expect(fU.acceptType('image/png')).toBe(true);
    });
    it('.mxf,video/*', function () {
        var options = { accept: '.mxf,video/*' };
        var fU = new FileUploader_class_1.FileUploader(options);
        expect(fU.acceptType('mxf/video')).toBe(false);
        expect(fU.acceptType('audio/mxf')).toBe(true);
        expect(fU.acceptType('video/mxf')).toBe(true);
        expect(fU.acceptType('', '<my-file>.mxf')).toBe(true);
    });
});
