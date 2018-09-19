/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, Renderer2, ElementRef, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
/** @type {?} */
var clickElements = new Set();
var ClickDirective = /** @class */ (function () {
    function ClickDirective(renderer, elm, document) {
        this.renderer = renderer;
        this.elm = elm;
        this.document = document;
        this.click = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ClickDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        clickElements.add(this.elm.nativeElement);
        /** @type {?} */
        var eventName = typeof window !== 'undefined' && typeof window['Hammer'] !== 'undefined'
            ? 'tap'
            : 'click';
        this.removeListener = this.renderer.listen(this.elm.nativeElement, eventName, function (event) {
            /** @type {?} */
            var nearestClickableParent = event.target;
            while (!clickElements.has(nearestClickableParent) &&
                nearestClickableParent !== _this.document.body) {
                nearestClickableParent = nearestClickableParent.parentElement;
            }
            /** @type {?} */
            var isThisClickableElement = _this.elm.nativeElement === nearestClickableParent;
            if (isThisClickableElement) {
                _this.click.next(event);
            }
        });
    };
    /**
     * @return {?}
     */
    ClickDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.removeListener();
        clickElements.delete(this.elm.nativeElement);
    };
    ClickDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mwlClick]'
                },] }
    ];
    /** @nocollapse */
    ClickDirective.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    ClickDirective.propDecorators = {
        click: [{ type: Output, args: ['mwlClick',] }]
    };
    return ClickDirective;
}());
export { ClickDirective };
if (false) {
    /** @type {?} */
    ClickDirective.prototype.click;
    /** @type {?} */
    ClickDirective.prototype.removeListener;
    /** @type {?} */
    ClickDirective.prototype.renderer;
    /** @type {?} */
    ClickDirective.prototype.elm;
    /** @type {?} */
    ClickDirective.prototype.document;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2suZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvY29tbW9uL2NsaWNrLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUdWLE1BQU0sRUFDTixZQUFZLEVBQ1osTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFFM0MsSUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQzs7SUFXM0Msd0JBQ1UsVUFDQSxLQUNrQixRQUFRO1FBRjFCLGFBQVEsR0FBUixRQUFRO1FBQ1IsUUFBRyxHQUFILEdBQUc7UUFDZSxhQUFRLEdBQVIsUUFBUSxDQUFBO3FCQVBGLElBQUksWUFBWSxFQUFFO0tBUWhEOzs7O0lBRUosaUNBQVE7OztJQUFSO1FBQUEsaUJBeUJDO1FBeEJDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7UUFDMUMsSUFBTSxTQUFTLEdBQ2IsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFdBQVc7WUFDdEUsQ0FBQyxDQUFDLEtBQUs7WUFDUCxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQ3RCLFNBQVMsRUFDVCxVQUFBLEtBQUs7O1lBRUgsSUFBSSxzQkFBc0IsR0FBZ0IsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUN2RCxPQUNFLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDMUMsc0JBQXNCLEtBQUssS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQzdDO2dCQUNBLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDLGFBQWEsQ0FBQzthQUMvRDs7WUFDRCxJQUFNLHNCQUFzQixHQUMxQixLQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsS0FBSyxzQkFBc0IsQ0FBQztZQUNwRCxJQUFJLHNCQUFzQixFQUFFO2dCQUMxQixLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN4QjtTQUNGLENBQ0YsQ0FBQztLQUNIOzs7O0lBRUQsb0NBQVc7OztJQUFYO1FBQ0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM5Qzs7Z0JBN0NGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsWUFBWTtpQkFDdkI7Ozs7Z0JBZEMsU0FBUztnQkFDVCxVQUFVO2dEQXVCUCxNQUFNLFNBQUMsUUFBUTs7O3dCQVJqQixNQUFNLFNBQUMsVUFBVTs7eUJBbEJwQjs7U0FpQmEsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgUmVuZGVyZXIyLFxuICBFbGVtZW50UmVmLFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuY29uc3QgY2xpY2tFbGVtZW50cyA9IG5ldyBTZXQ8SFRNTEVsZW1lbnQ+KCk7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xDbGlja10nXG59KVxuZXhwb3J0IGNsYXNzIENsaWNrRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCdtd2xDbGljaycpXG4gIGNsaWNrOiBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcblxuICBwcml2YXRlIHJlbW92ZUxpc3RlbmVyOiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGVsbTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudFxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgY2xpY2tFbGVtZW50cy5hZGQodGhpcy5lbG0ubmF0aXZlRWxlbWVudCk7XG4gICAgY29uc3QgZXZlbnROYW1lOiBzdHJpbmcgPVxuICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvd1snSGFtbWVyJ10gIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gJ3RhcCdcbiAgICAgICAgOiAnY2xpY2snO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsXG4gICAgICBldmVudE5hbWUsXG4gICAgICBldmVudCA9PiB7XG4gICAgICAgIC8vIHByZXZlbnQgY2hpbGQgY2xpY2sgZXZlbnRzIGZyb20gZmlyaW5nIG9uIHBhcmVudCBlbGVtZW50cyB0aGF0IGFsc28gaGF2ZSBjbGljayBldmVudHNcbiAgICAgICAgbGV0IG5lYXJlc3RDbGlja2FibGVQYXJlbnQ6IEhUTUxFbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgIWNsaWNrRWxlbWVudHMuaGFzKG5lYXJlc3RDbGlja2FibGVQYXJlbnQpICYmXG4gICAgICAgICAgbmVhcmVzdENsaWNrYWJsZVBhcmVudCAhPT0gdGhpcy5kb2N1bWVudC5ib2R5XG4gICAgICAgICkge1xuICAgICAgICAgIG5lYXJlc3RDbGlja2FibGVQYXJlbnQgPSBuZWFyZXN0Q2xpY2thYmxlUGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXNUaGlzQ2xpY2thYmxlRWxlbWVudCA9XG4gICAgICAgICAgdGhpcy5lbG0ubmF0aXZlRWxlbWVudCA9PT0gbmVhcmVzdENsaWNrYWJsZVBhcmVudDtcbiAgICAgICAgaWYgKGlzVGhpc0NsaWNrYWJsZUVsZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLmNsaWNrLm5leHQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoKTtcbiAgICBjbGlja0VsZW1lbnRzLmRlbGV0ZSh0aGlzLmVsbS5uYXRpdmVFbGVtZW50KTtcbiAgfVxufVxuIl19