/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
var /**
 * @abstract
 */
DateAdapter = /** @class */ (function () {
    function DateAdapter() {
    }
    return DateAdapter;
}());
/**
 * @abstract
 */
export { DateAdapter };
if (false) {
    /**
     * @abstract
     * @param {?} date
     * @param {?} amount
     * @return {?}
     */
    DateAdapter.prototype.addWeeks = function (date, amount) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} amount
     * @return {?}
     */
    DateAdapter.prototype.addMonths = function (date, amount) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} amount
     * @return {?}
     */
    DateAdapter.prototype.subDays = function (date, amount) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} amount
     * @return {?}
     */
    DateAdapter.prototype.subWeeks = function (date, amount) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} amount
     * @return {?}
     */
    DateAdapter.prototype.subMonths = function (date, amount) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.getISOWeek = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} dayOfMonth
     * @return {?}
     */
    DateAdapter.prototype.setDate = function (date, dayOfMonth) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} month
     * @return {?}
     */
    DateAdapter.prototype.setMonth = function (date, month) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} year
     * @return {?}
     */
    DateAdapter.prototype.setYear = function (date, year) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.getDate = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.getMonth = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.getYear = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} amount
     * @return {?}
     */
    DateAdapter.prototype.addDays = function (date, amount) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} amount
     * @return {?}
     */
    DateAdapter.prototype.addHours = function (date, amount) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} amount
     * @return {?}
     */
    DateAdapter.prototype.addMinutes = function (date, amount) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} amount
     * @return {?}
     */
    DateAdapter.prototype.addSeconds = function (date, amount) { };
    /**
     * @abstract
     * @param {?} dateLeft
     * @param {?} dateRight
     * @return {?}
     */
    DateAdapter.prototype.differenceInDays = function (dateLeft, dateRight) { };
    /**
     * @abstract
     * @param {?} dateLeft
     * @param {?} dateRight
     * @return {?}
     */
    DateAdapter.prototype.differenceInMinutes = function (dateLeft, dateRight) { };
    /**
     * @abstract
     * @param {?} dateLeft
     * @param {?} dateRight
     * @return {?}
     */
    DateAdapter.prototype.differenceInSeconds = function (dateLeft, dateRight) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.endOfDay = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.endOfMonth = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?=} options
     * @return {?}
     */
    DateAdapter.prototype.endOfWeek = function (date, options) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.getDay = function (date) { };
    /**
     * @abstract
     * @param {?} dateLeft
     * @param {?} dateRight
     * @return {?}
     */
    DateAdapter.prototype.isSameDay = function (dateLeft, dateRight) { };
    /**
     * @abstract
     * @param {?} dateLeft
     * @param {?} dateRight
     * @return {?}
     */
    DateAdapter.prototype.isSameMonth = function (dateLeft, dateRight) { };
    /**
     * @abstract
     * @param {?} dateLeft
     * @param {?} dateRight
     * @return {?}
     */
    DateAdapter.prototype.isSameSecond = function (dateLeft, dateRight) { };
    /**
     * @abstract
     * @param {...?} dates
     * @return {?}
     */
    DateAdapter.prototype.max = function (dates) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} hours
     * @return {?}
     */
    DateAdapter.prototype.setHours = function (date, hours) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?} minutes
     * @return {?}
     */
    DateAdapter.prototype.setMinutes = function (date, minutes) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.startOfDay = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.startOfMinute = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.startOfMonth = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?=} options
     * @return {?}
     */
    DateAdapter.prototype.startOfWeek = function (date, options) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.getHours = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    DateAdapter.prototype.getMinutes = function (date) { };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbImRhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7O0FBQUE7OztzQkFGQTtJQWdHQyxDQUFBOzs7O0FBOUZELHVCQThGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGVBZGFwdGVyIGFzIEJhc2VEYXRlQWRhcHRlciB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERhdGVBZGFwdGVyIGltcGxlbWVudHMgQmFzZURhdGVBZGFwdGVyIHtcbiAgYWJzdHJhY3QgYWRkV2Vla3MoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgYW1vdW50OiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGFkZE1vbnRocyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBhbW91bnQ6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3Qgc3ViRGF5cyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBhbW91bnQ6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3Qgc3ViV2Vla3MoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgYW1vdW50OiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHN1Yk1vbnRocyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBhbW91bnQ6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3QgZ2V0SVNPV2VlayhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyO1xuXG4gIGFic3RyYWN0IHNldERhdGUoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgZGF5T2ZNb250aDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzZXRNb250aChkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBtb250aDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzZXRZZWFyKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIHllYXI6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3QgZ2V0RGF0ZShkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyO1xuXG4gIGFic3RyYWN0IGdldE1vbnRoKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXI7XG5cbiAgYWJzdHJhY3QgZ2V0WWVhcihkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyO1xuXG4gIGFic3RyYWN0IGFkZERheXMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgYW1vdW50OiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGFkZEhvdXJzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGFtb3VudDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBhZGRNaW51dGVzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGFtb3VudDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBhZGRTZWNvbmRzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGFtb3VudDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBkaWZmZXJlbmNlSW5EYXlzKFxuICAgIGRhdGVMZWZ0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLFxuICAgIGRhdGVSaWdodDogRGF0ZSB8IHN0cmluZyB8IG51bWJlclxuICApOiBudW1iZXI7XG5cbiAgYWJzdHJhY3QgZGlmZmVyZW5jZUluTWludXRlcyhcbiAgICBkYXRlTGVmdDogRGF0ZSB8IHN0cmluZyB8IG51bWJlcixcbiAgICBkYXRlUmlnaHQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXJcbiAgKTogbnVtYmVyO1xuXG4gIGFic3RyYWN0IGRpZmZlcmVuY2VJblNlY29uZHMoXG4gICAgZGF0ZUxlZnQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgZGF0ZVJpZ2h0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyXG4gICk6IG51bWJlcjtcblxuICBhYnN0cmFjdCBlbmRPZkRheShkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBlbmRPZk1vbnRoKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGVuZE9mV2VlayhcbiAgICBkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLFxuICAgIG9wdGlvbnM/OiB7IHdlZWtTdGFydHNPbj86IG51bWJlciB9XG4gICk6IERhdGU7XG5cbiAgYWJzdHJhY3QgZ2V0RGF5KGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXI7XG5cbiAgYWJzdHJhY3QgaXNTYW1lRGF5KFxuICAgIGRhdGVMZWZ0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLFxuICAgIGRhdGVSaWdodDogRGF0ZSB8IHN0cmluZyB8IG51bWJlclxuICApOiBib29sZWFuO1xuXG4gIGFic3RyYWN0IGlzU2FtZU1vbnRoKFxuICAgIGRhdGVMZWZ0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLFxuICAgIGRhdGVSaWdodDogRGF0ZSB8IHN0cmluZyB8IG51bWJlclxuICApOiBib29sZWFuO1xuXG4gIGFic3RyYWN0IGlzU2FtZVNlY29uZChcbiAgICBkYXRlTGVmdDogRGF0ZSB8IHN0cmluZyB8IG51bWJlcixcbiAgICBkYXRlUmlnaHQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXJcbiAgKTogYm9vbGVhbjtcblxuICBhYnN0cmFjdCBtYXgoLi4uZGF0ZXM6IEFycmF5PERhdGUgfCBzdHJpbmcgfCBudW1iZXI+KTogRGF0ZTtcblxuICBhYnN0cmFjdCBzZXRIb3VycyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBob3VyczogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzZXRNaW51dGVzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIG1pbnV0ZXM6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3Qgc3RhcnRPZkRheShkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzdGFydE9mTWludXRlKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHN0YXJ0T2ZNb250aChkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzdGFydE9mV2VlayhcbiAgICBkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLFxuICAgIG9wdGlvbnM/OiB7IHdlZWtTdGFydHNPbj86IG51bWJlciB9XG4gICk6IERhdGU7XG5cbiAgYWJzdHJhY3QgZ2V0SG91cnMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IG51bWJlcjtcblxuICBhYnN0cmFjdCBnZXRNaW51dGVzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXI7XG59XG4iXX0=