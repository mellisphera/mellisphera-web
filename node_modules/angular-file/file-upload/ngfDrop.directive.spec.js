"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var ngf_module_1 = require("./ngf.module");
var ContainerComponent = (function () {
    function ContainerComponent() {
    }
    return ContainerComponent;
}());
exports.ContainerComponent = ContainerComponent;
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
exports.AppModule = AppModule;
describe('ngfDrop', function () {
    var fixture;
    var component;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [AppModule]
        });
        testing_1.TestBed.compileComponents()
            .then(function () {
            fixture = testing_1.TestBed.createComponent(ContainerComponent);
            fixture.detectChanges();
            component = fixture.componentInstance;
        });
    }));
    it('inits', function () {
        expect(fixture).not.toBeNull();
        expect(component).not.toBeNull();
    });
    it('uploader', function () {
        expect(component.ngf.uploader).not.toBeNull();
    });
    it('#getFormData', function () {
        expect(component.ngf.uploader.getFormData.constructor).toEqual(Function);
        expect(component.ngf.uploader.getFormData().constructor).toEqual(FormData);
    });
});
