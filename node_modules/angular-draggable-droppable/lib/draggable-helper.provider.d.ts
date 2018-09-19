import { Subject } from 'rxjs';
export interface CurrentDragData {
    clientX: number;
    clientY: number;
    dropData: any;
}
export declare class DraggableHelper {
    currentDrag: Subject<Subject<CurrentDragData>>;
}
