import { EventEmitter } from '@angular/core';
import { ngf } from "./ngf.directive";
export interface dragMeta {
    type: string;
    kind: string;
}
export declare class ngfDrop extends ngf {
    fileOver: EventEmitter<any>;
    validDrag: boolean;
    validDragChange: EventEmitter<boolean>;
    invalidDrag: boolean;
    invalidDragChange: EventEmitter<boolean>;
    dragFiles: dragMeta[];
    dragFilesChange: EventEmitter<dragMeta[]>;
    onDrop(event: Event): void;
    handleFiles(files: File[]): void;
    onDragOver(event: Event): void;
    /** browsers try hard to conceal data about file drags, this tends to undo that */
    filesToWriteableObject(files: File[]): dragMeta[];
    closeDrags(): void;
    onDragLeave(event: Event): any;
}
