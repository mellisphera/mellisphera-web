import { EventEmitter } from '@angular/core';
import { FileUploaderOptions, FileUploader } from "./FileUploader.class";
export declare class ngfUploader extends FileUploader {
    ref: ngfUploader;
    refChange: EventEmitter<ngfUploader>;
    options: FileUploaderOptions;
    constructor();
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    uploadFiles(files: File[]): Promise<any>;
    xhrOneByOne(files: File[]): Promise<any[]>;
}
