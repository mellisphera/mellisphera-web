/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { isInside } from './util';
/** @type {?} */
const DRAG_THRESHOLD = 1;
export class CalendarDragHelper {
    /**
     * @param {?} dragContainerElement
     * @param {?} draggableElement
     */
    constructor(dragContainerElement, draggableElement) {
        this.dragContainerElement = dragContainerElement;
        this.startPosition = draggableElement.getBoundingClientRect();
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    validateDrag({ x, y, snapDraggedEvents }) {
        /** @type {?} */
        const isWithinThreshold = Math.abs(x) > DRAG_THRESHOLD || Math.abs(y) > DRAG_THRESHOLD;
        if (snapDraggedEvents) {
            /** @type {?} */
            const newRect = Object.assign({}, this.startPosition, {
                left: this.startPosition.left + x,
                right: this.startPosition.right + x,
                top: this.startPosition.top + y,
                bottom: this.startPosition.bottom + y
            });
            return (isWithinThreshold &&
                isInside(this.dragContainerElement.getBoundingClientRect(), newRect));
        }
        else {
            return isWithinThreshold;
        }
    }
}
if (false) {
    /** @type {?} */
    CalendarDragHelper.prototype.startPosition;
    /** @type {?} */
    CalendarDragHelper.prototype.dragContainerElement;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZHJhZy1oZWxwZXIucHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy9jb21tb24vY2FsZW5kYXItZHJhZy1oZWxwZXIucHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxRQUFRLENBQUM7O0FBRWxDLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBQztBQUV6QixNQUFNOzs7OztJQUdKLFlBQ1Usc0JBQ1IsZ0JBQTZCO1FBRHJCLHlCQUFvQixHQUFwQixvQkFBb0I7UUFHNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0tBQy9EOzs7OztJQUVELFlBQVksQ0FBQyxFQUNYLENBQUMsRUFDRCxDQUFDLEVBQ0QsaUJBQWlCLEVBS2xCOztRQUNDLE1BQU0saUJBQWlCLEdBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDO1FBRS9ELElBQUksaUJBQWlCLEVBQUU7O1lBQ3JCLE1BQU0sT0FBTyxHQUFlLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ2hFLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxDQUFDO2dCQUNqQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsQ0FBQztnQkFDbkMsR0FBRyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDO2FBQ3RDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FDTCxpQkFBaUI7Z0JBQ2pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FDckUsQ0FBQztTQUNIO2FBQU07WUFDTCxPQUFPLGlCQUFpQixDQUFDO1NBQzFCO0tBQ0Y7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzSW5zaWRlIH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgRFJBR19USFJFU0hPTEQgPSAxO1xuXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJEcmFnSGVscGVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBzdGFydFBvc2l0aW9uOiBDbGllbnRSZWN0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZHJhZ0NvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIGRyYWdnYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50XG4gICkge1xuICAgIHRoaXMuc3RhcnRQb3NpdGlvbiA9IGRyYWdnYWJsZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIH1cblxuICB2YWxpZGF0ZURyYWcoe1xuICAgIHgsXG4gICAgeSxcbiAgICBzbmFwRHJhZ2dlZEV2ZW50c1xuICB9OiB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBzbmFwRHJhZ2dlZEV2ZW50czogYm9vbGVhbjtcbiAgfSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGlzV2l0aGluVGhyZXNob2xkID1cbiAgICAgIE1hdGguYWJzKHgpID4gRFJBR19USFJFU0hPTEQgfHwgTWF0aC5hYnMoeSkgPiBEUkFHX1RIUkVTSE9MRDtcblxuICAgIGlmIChzbmFwRHJhZ2dlZEV2ZW50cykge1xuICAgICAgY29uc3QgbmV3UmVjdDogQ2xpZW50UmVjdCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhcnRQb3NpdGlvbiwge1xuICAgICAgICBsZWZ0OiB0aGlzLnN0YXJ0UG9zaXRpb24ubGVmdCArIHgsXG4gICAgICAgIHJpZ2h0OiB0aGlzLnN0YXJ0UG9zaXRpb24ucmlnaHQgKyB4LFxuICAgICAgICB0b3A6IHRoaXMuc3RhcnRQb3NpdGlvbi50b3AgKyB5LFxuICAgICAgICBib3R0b206IHRoaXMuc3RhcnRQb3NpdGlvbi5ib3R0b20gKyB5XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgaXNXaXRoaW5UaHJlc2hvbGQgJiZcbiAgICAgICAgaXNJbnNpZGUodGhpcy5kcmFnQ29udGFpbmVyRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbmV3UmVjdClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc1dpdGhpblRocmVzaG9sZDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==