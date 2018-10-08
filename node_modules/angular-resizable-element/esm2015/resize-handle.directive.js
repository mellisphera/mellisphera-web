/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, Input, HostListener, Renderer2, ElementRef, NgZone } from '@angular/core';
import { ResizableDirective } from './resizable.directive';
/**
 * An element placed inside a `mwlResizable` directive to be used as a drag and resize handle
 *
 * For example
 *
 * ```html
 * <div mwlResizable>
 *   <div mwlResizeHandle [resizeEdges]="{bottom: true, right: true}"></div>
 * </div>
 * ```
 */
export class ResizeHandleDirective {
    /**
     * @param {?} renderer
     * @param {?} element
     * @param {?} zone
     * @param {?} resizable
     */
    constructor(renderer, element, zone, resizable) {
        this.renderer = renderer;
        this.element = element;
        this.zone = zone;
        this.resizable = resizable;
        /**
         * The `Edges` object that contains the edges of the parent element that dragging the handle will trigger a resize on
         */
        this.resizeEdges = {};
        this.eventListeners = {};
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.unsubscribeEventListeners();
    }
    /**
     * @hidden
     * @param {?} event
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    onMousedown(event, clientX, clientY) {
        event.preventDefault();
        this.zone.runOutsideAngular(() => {
            if (!this.eventListeners.touchmove) {
                this.eventListeners.touchmove = this.renderer.listen(this.element.nativeElement, 'touchmove', (touchMoveEvent) => {
                    this.onMousemove(touchMoveEvent, touchMoveEvent.targetTouches[0].clientX, touchMoveEvent.targetTouches[0].clientY);
                });
            }
            if (!this.eventListeners.mousemove) {
                this.eventListeners.mousemove = this.renderer.listen(this.element.nativeElement, 'mousemove', (mouseMoveEvent) => {
                    this.onMousemove(mouseMoveEvent, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
                });
            }
            this.resizable.mousedown.next({
                clientX,
                clientY,
                edges: this.resizeEdges
            });
        });
    }
    /**
     * @hidden
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    onMouseup(clientX, clientY) {
        this.zone.runOutsideAngular(() => {
            this.unsubscribeEventListeners();
            this.resizable.mouseup.next({
                clientX,
                clientY,
                edges: this.resizeEdges
            });
        });
    }
    /**
     * @param {?} event
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    onMousemove(event, clientX, clientY) {
        this.resizable.mousemove.next({
            clientX,
            clientY,
            edges: this.resizeEdges,
            event
        });
    }
    /**
     * @return {?}
     */
    unsubscribeEventListeners() {
        Object.keys(this.eventListeners).forEach(type => {
            (/** @type {?} */ (this)).eventListeners[type]();
            delete this.eventListeners[type];
        });
    }
}
ResizeHandleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlResizeHandle]'
            },] }
];
/** @nocollapse */
ResizeHandleDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: NgZone },
    { type: ResizableDirective }
];
ResizeHandleDirective.propDecorators = {
    resizeEdges: [{ type: Input }],
    onMousedown: [{ type: HostListener, args: ['touchstart', [
                    '$event',
                    '$event.touches[0].clientX',
                    '$event.touches[0].clientY'
                ],] }, { type: HostListener, args: ['mousedown', ['$event', '$event.clientX', '$event.clientY'],] }],
    onMouseup: [{ type: HostListener, args: ['touchend', [
                    '$event.changedTouches[0].clientX',
                    '$event.changedTouches[0].clientY'
                ],] }, { type: HostListener, args: ['touchcancel', [
                    '$event.changedTouches[0].clientX',
                    '$event.changedTouches[0].clientY'
                ],] }, { type: HostListener, args: ['mouseup', ['$event.clientX', '$event.clientY'],] }]
};
if (false) {
    /**
     * The `Edges` object that contains the edges of the parent element that dragging the handle will trigger a resize on
     * @type {?}
     */
    ResizeHandleDirective.prototype.resizeEdges;
    /** @type {?} */
    ResizeHandleDirective.prototype.eventListeners;
    /** @type {?} */
    ResizeHandleDirective.prototype.renderer;
    /** @type {?} */
    ResizeHandleDirective.prototype.element;
    /** @type {?} */
    ResizeHandleDirective.prototype.zone;
    /** @type {?} */
    ResizeHandleDirective.prototype.resizable;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLWhhbmRsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLXJlc2l6YWJsZS1lbGVtZW50LyIsInNvdXJjZXMiOlsicmVzaXplLWhhbmRsZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLFlBQVksRUFDWixTQUFTLEVBQ1QsVUFBVSxFQUVWLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7Ozs7Ozs7Ozs7O0FBaUIzRCxNQUFNOzs7Ozs7O0lBYUosWUFDVSxVQUNBLFNBQ0EsTUFDQTtRQUhBLGFBQVEsR0FBUixRQUFRO1FBQ1IsWUFBTyxHQUFQLE9BQU87UUFDUCxTQUFJLEdBQUosSUFBSTtRQUNKLGNBQVMsR0FBVCxTQUFTOzs7OzJCQVpFLEVBQUU7OEJBTW5CLEVBQUU7S0FPRjs7OztJQUVKLFdBQVc7UUFDVCxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztLQUNsQzs7Ozs7Ozs7SUFXRCxXQUFXLENBQ1QsS0FBOEIsRUFDOUIsT0FBZSxFQUNmLE9BQWU7UUFFZixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFO2dCQUNsQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQzFCLFdBQVcsRUFDWCxDQUFDLGNBQTBCLEVBQUUsRUFBRTtvQkFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FDZCxjQUFjLEVBQ2QsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQ3ZDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUN4QyxDQUFDO2lCQUNILENBQ0YsQ0FBQzthQUNIO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFO2dCQUNsQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQzFCLFdBQVcsRUFDWCxDQUFDLGNBQTBCLEVBQUUsRUFBRTtvQkFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FDZCxjQUFjLEVBQ2QsY0FBYyxDQUFDLE9BQU8sRUFDdEIsY0FBYyxDQUFDLE9BQU8sQ0FDdkIsQ0FBQztpQkFDSCxDQUNGLENBQUM7YUFDSDtZQUNELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDNUIsT0FBTztnQkFDUCxPQUFPO2dCQUNQLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVzthQUN4QixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7S0FDSjs7Ozs7OztJQWNELFNBQVMsQ0FBQyxPQUFlLEVBQUUsT0FBZTtRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUMvQixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLE9BQU87Z0JBQ1AsT0FBTztnQkFDUCxLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVc7YUFDeEIsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7SUFFTyxXQUFXLENBQ2pCLEtBQThCLEVBQzlCLE9BQWUsRUFDZixPQUFlO1FBRWYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQzVCLE9BQU87WUFDUCxPQUFPO1lBQ1AsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQ3ZCLEtBQUs7U0FDTixDQUFDLENBQUM7Ozs7O0lBR0cseUJBQXlCO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QyxtQkFBQyxJQUFXLEVBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNyQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEMsQ0FBQyxDQUFDOzs7O1lBckhOLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2FBQzlCOzs7O1lBckJDLFNBQVM7WUFDVCxVQUFVO1lBRVYsTUFBTTtZQUVDLGtCQUFrQjs7OzBCQXFCeEIsS0FBSzswQkF1QkwsWUFBWSxTQUFDLFlBQVksRUFBRTtvQkFDMUIsUUFBUTtvQkFDUiwyQkFBMkI7b0JBQzNCLDJCQUEyQjtpQkFDNUIsY0FDQSxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQTZDeEUsWUFBWSxTQUFDLFVBQVUsRUFBRTtvQkFDeEIsa0NBQWtDO29CQUNsQyxrQ0FBa0M7aUJBQ25DLGNBQ0EsWUFBWSxTQUFDLGFBQWEsRUFBRTtvQkFDM0Isa0NBQWtDO29CQUNsQyxrQ0FBa0M7aUJBQ25DLGNBQ0EsWUFBWSxTQUFDLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgSG9zdExpc3RlbmVyLFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWYsXG4gIE9uRGVzdHJveSxcbiAgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUmVzaXphYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9yZXNpemFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IEVkZ2VzIH0gZnJvbSAnLi9pbnRlcmZhY2VzL2VkZ2VzLmludGVyZmFjZSc7XG5cbi8qKlxuICogQW4gZWxlbWVudCBwbGFjZWQgaW5zaWRlIGEgYG13bFJlc2l6YWJsZWAgZGlyZWN0aXZlIHRvIGJlIHVzZWQgYXMgYSBkcmFnIGFuZCByZXNpemUgaGFuZGxlXG4gKlxuICogRm9yIGV4YW1wbGVcbiAqXG4gKiBgYGBodG1sXG4gKiA8ZGl2IG13bFJlc2l6YWJsZT5cbiAqICAgPGRpdiBtd2xSZXNpemVIYW5kbGUgW3Jlc2l6ZUVkZ2VzXT1cIntib3R0b206IHRydWUsIHJpZ2h0OiB0cnVlfVwiPjwvZGl2PlxuICogPC9kaXY+XG4gKiBgYGBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bFJlc2l6ZUhhbmRsZV0nXG59KVxuZXhwb3J0IGNsYXNzIFJlc2l6ZUhhbmRsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBUaGUgYEVkZ2VzYCBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZWRnZXMgb2YgdGhlIHBhcmVudCBlbGVtZW50IHRoYXQgZHJhZ2dpbmcgdGhlIGhhbmRsZSB3aWxsIHRyaWdnZXIgYSByZXNpemUgb25cbiAgICovXG4gIEBJbnB1dCgpXG4gIHJlc2l6ZUVkZ2VzOiBFZGdlcyA9IHt9O1xuXG4gIHByaXZhdGUgZXZlbnRMaXN0ZW5lcnM6IHtcbiAgICB0b3VjaG1vdmU/OiAoKSA9PiB2b2lkO1xuICAgIG1vdXNlbW92ZT86ICgpID0+IHZvaWQ7XG4gICAgW2tleTogc3RyaW5nXTogKCgpID0+IHZvaWQpIHwgdW5kZWZpbmVkO1xuICB9ID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlc2l6YWJsZTogUmVzaXphYmxlRGlyZWN0aXZlXG4gICkge31cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgW1xuICAgICckZXZlbnQnLFxuICAgICckZXZlbnQudG91Y2hlc1swXS5jbGllbnRYJyxcbiAgICAnJGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSdcbiAgXSlcbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnLCAnJGV2ZW50LmNsaWVudFgnLCAnJGV2ZW50LmNsaWVudFknXSlcbiAgb25Nb3VzZWRvd24oXG4gICAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LFxuICAgIGNsaWVudFg6IG51bWJlcixcbiAgICBjbGllbnRZOiBudW1iZXJcbiAgKTogdm9pZCB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJzLnRvdWNobW92ZSkge1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnRvdWNobW92ZSA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgICAgICh0b3VjaE1vdmVFdmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlbW92ZShcbiAgICAgICAgICAgICAgdG91Y2hNb3ZlRXZlbnQsXG4gICAgICAgICAgICAgIHRvdWNoTW92ZUV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVycy5tb3VzZW1vdmUpIHtcbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVycy5tb3VzZW1vdmUgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICAgICAobW91c2VNb3ZlRXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZW1vdmUoXG4gICAgICAgICAgICAgIG1vdXNlTW92ZUV2ZW50LFxuICAgICAgICAgICAgICBtb3VzZU1vdmVFdmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICBtb3VzZU1vdmVFdmVudC5jbGllbnRZXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVzaXphYmxlLm1vdXNlZG93bi5uZXh0KHtcbiAgICAgICAgY2xpZW50WCxcbiAgICAgICAgY2xpZW50WSxcbiAgICAgICAgZWRnZXM6IHRoaXMucmVzaXplRWRnZXNcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoZW5kJywgW1xuICAgICckZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCcsXG4gICAgJyRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZJ1xuICBdKVxuICBASG9zdExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIFtcbiAgICAnJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgnLFxuICAgICckZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSdcbiAgXSlcbiAgQEhvc3RMaXN0ZW5lcignbW91c2V1cCcsIFsnJGV2ZW50LmNsaWVudFgnLCAnJGV2ZW50LmNsaWVudFknXSlcbiAgb25Nb3VzZXVwKGNsaWVudFg6IG51bWJlciwgY2xpZW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpO1xuICAgICAgdGhpcy5yZXNpemFibGUubW91c2V1cC5uZXh0KHtcbiAgICAgICAgY2xpZW50WCxcbiAgICAgICAgY2xpZW50WSxcbiAgICAgICAgZWRnZXM6IHRoaXMucmVzaXplRWRnZXNcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlbW92ZShcbiAgICBldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsXG4gICAgY2xpZW50WDogbnVtYmVyLFxuICAgIGNsaWVudFk6IG51bWJlclxuICApOiB2b2lkIHtcbiAgICB0aGlzLnJlc2l6YWJsZS5tb3VzZW1vdmUubmV4dCh7XG4gICAgICBjbGllbnRYLFxuICAgICAgY2xpZW50WSxcbiAgICAgIGVkZ2VzOiB0aGlzLnJlc2l6ZUVkZ2VzLFxuICAgICAgZXZlbnRcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50TGlzdGVuZXJzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgKHRoaXMgYXMgYW55KS5ldmVudExpc3RlbmVyc1t0eXBlXSgpO1xuICAgICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lcnNbdHlwZV07XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==