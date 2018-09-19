export declare class CalendarDragHelper {
    private dragContainerElement;
    private readonly startPosition;
    constructor(dragContainerElement: HTMLElement, draggableElement: HTMLElement);
    validateDrag({ x, y, snapDraggedEvents }: {
        x: number;
        y: number;
        snapDraggedEvents: boolean;
    }): boolean;
}
