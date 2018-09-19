/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { DateAdapter } from '../../date-adapters/date-adapter';
/**
 * Change the view date to the current day. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarToday
 *  [(viewDate)]="viewDate">
 *  Today
 * </button>
 * ```
 */
var CalendarTodayDirective = /** @class */ (function () {
    function CalendarTodayDirective(dateAdapter) {
        this.dateAdapter = dateAdapter;
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
    }
    /**
     * @hidden
     */
    /**
     * @hidden
     * @return {?}
     */
    CalendarTodayDirective.prototype.onClick = /**
     * @hidden
     * @return {?}
     */
    function () {
        this.viewDateChange.emit(this.dateAdapter.startOfDay(new Date()));
    };
    CalendarTodayDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mwlCalendarToday]'
                },] }
    ];
    /** @nocollapse */
    CalendarTodayDirective.ctorParameters = function () { return [
        { type: DateAdapter }
    ]; };
    CalendarTodayDirective.propDecorators = {
        viewDate: [{ type: Input }],
        viewDateChange: [{ type: Output }],
        onClick: [{ type: HostListener, args: ['click',] }]
    };
    return CalendarTodayDirective;
}());
export { CalendarTodayDirective };
if (false) {
    /**
     * The current view date
     * @type {?}
     */
    CalendarTodayDirective.prototype.viewDate;
    /**
     * Called when the view date is changed
     * @type {?}
     */
    CalendarTodayDirective.prototype.viewDateChange;
    /** @type {?} */
    CalendarTodayDirective.prototype.dateAdapter;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItdG9kYXkuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvY29tbW9uL2NhbGVuZGFyLXRvZGF5LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7Ozs7Ozs7Ozs7O0lBNkI3RCxnQ0FBb0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7Ozs7OEJBRlAsSUFBSSxZQUFZLEVBQUU7S0FFUDtJQUVoRDs7T0FFRzs7Ozs7SUFFSCx3Q0FBTzs7OztJQURQO1FBRUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbkU7O2dCQXhCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtpQkFDL0I7Ozs7Z0JBZlEsV0FBVzs7OzJCQW9CakIsS0FBSztpQ0FNTCxNQUFNOzBCQVFOLFlBQVksU0FBQyxPQUFPOztpQ0F6Q3ZCOztTQXVCYSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRlLWFkYXB0ZXJzL2RhdGUtYWRhcHRlcic7XG5cbi8qKlxuICogQ2hhbmdlIHRoZSB2aWV3IGRhdGUgdG8gdGhlIGN1cnJlbnQgZGF5LiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiA8YnV0dG9uXG4gKiAgbXdsQ2FsZW5kYXJUb2RheVxuICogIFsodmlld0RhdGUpXT1cInZpZXdEYXRlXCI+XG4gKiAgVG9kYXlcbiAqIDwvYnV0dG9uPlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xDYWxlbmRhclRvZGF5XSdcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJUb2RheURpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB2aWV3IGRhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHZpZXdEYXRlOiBEYXRlO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdmlldyBkYXRlIGlzIGNoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICB2aWV3RGF0ZUNoYW5nZTogRXZlbnRFbWl0dGVyPERhdGU+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyKSB7fVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgdGhpcy52aWV3RGF0ZUNoYW5nZS5lbWl0KHRoaXMuZGF0ZUFkYXB0ZXIuc3RhcnRPZkRheShuZXcgRGF0ZSgpKSk7XG4gIH1cbn1cbiJdfQ==