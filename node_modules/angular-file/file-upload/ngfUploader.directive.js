"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
//import { Http, Response, Request } from '@angular/http';
//import 'rxjs/add/operator/toPromise';
var FileUploader_class_1 = require("./FileUploader.class");
var FileItem_class_1 = require("./FileItem.class");
var ngfUploader = (function (_super) {
    __extends(ngfUploader, _super);
    //@Input() useNgHttp:any = false
    function ngfUploader() {
        var _this = _super.call(this) || this;
        _this.refChange = new core_1.EventEmitter();
        _this.options = {
            autoUpload: false,
            isHTML5: true,
            filters: [],
            removeAfterUpload: false,
            disableMultipart: false
        };
        return _this;
    }
    ngfUploader.prototype.ngOnInit = function () {
        var _this = this;
        //create reference to this class with one cycle delay to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(function () {
            _this.refChange.emit(_this);
            //this.directiveInit.emit(this)
        }, 0);
    };
    ngfUploader.prototype.ngOnChanges = function (changes) {
        if (changes.options) {
            this.setOptions(changes.options.currentValue);
        }
    };
    ngfUploader.prototype.uploadFiles = function (files) {
        var _this = this;
        var valids = [];
        files.map(function (file) {
            if (_this.isFileValid(file)) {
                valids.push(file);
            }
        });
        //const promise:Promise<any> = this.useNgHttp ? this.ngHttpFiles( this.getFormData(valids) ) : this.xhrOneByOne(valids)
        var promise = this.xhrOneByOne(valids);
        return promise.then(function (response) { return _this.success.emit(response); })
            .catch(function (e) {
            _this.catcher.emit(e);
            _this.done.emit(e);
            return Promise.reject(e);
        });
    };
    //old school way to send files. Still pretty handy
    //old school way to send files. Still pretty handy
    ngfUploader.prototype.xhrOneByOne = 
    //old school way to send files. Still pretty handy
    function (files) {
        var _this = this;
        var promises = files.map(function (file) {
            var fileItem = new FileItem_class_1.FileItem(_this, file, _this.options);
            return _this._xhrTransport(fileItem);
        });
        return Promise.all(promises);
    };
    /*ngHttpFiles( formData:FormData ){
        const config:any = Object.assign({}, this.options)
        config.body = formData
        const request = new Request(config)
        return this.postRequest(config)
      }
    
      postRequest( config:Request ):Promise<Response>{
        return this.Http.request( config ).toPromise()
      }*/
    ngfUploader.decorators = [
        { type: core_1.Directive, args: [{ selector: 'ngfUploader' },] },
    ];
    /** @nocollapse */
    ngfUploader.ctorParameters = function () { return []; };
    ngfUploader.propDecorators = {
        "ref": [{ type: core_1.Input },],
        "refChange": [{ type: core_1.Output },],
        "options": [{ type: core_1.Input },],
    };
    return ngfUploader;
}(FileUploader_class_1.FileUploader));
exports.ngfUploader = ngfUploader;
