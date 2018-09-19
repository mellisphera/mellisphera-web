/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
export class DateAdapter {
}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbImRhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQSxNQUFNO0NBOEZMIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgYXMgQmFzZURhdGVBZGFwdGVyIH0gZnJvbSAnY2FsZW5kYXItdXRpbHMvZGF0ZS1hZGFwdGVycy9kYXRlLWFkYXB0ZXInO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGF0ZUFkYXB0ZXIgaW1wbGVtZW50cyBCYXNlRGF0ZUFkYXB0ZXIge1xuICBhYnN0cmFjdCBhZGRXZWVrcyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBhbW91bnQ6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3QgYWRkTW9udGhzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGFtb3VudDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzdWJEYXlzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGFtb3VudDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzdWJXZWVrcyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBhbW91bnQ6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3Qgc3ViTW9udGhzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGFtb3VudDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBnZXRJU09XZWVrKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXI7XG5cbiAgYWJzdHJhY3Qgc2V0RGF0ZShkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBkYXlPZk1vbnRoOiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHNldE1vbnRoKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIG1vbnRoOiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHNldFllYXIoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgeWVhcjogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBnZXREYXRlKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXI7XG5cbiAgYWJzdHJhY3QgZ2V0TW9udGgoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IG51bWJlcjtcblxuICBhYnN0cmFjdCBnZXRZZWFyKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXI7XG5cbiAgYWJzdHJhY3QgYWRkRGF5cyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBhbW91bnQ6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3QgYWRkSG91cnMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgYW1vdW50OiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGFkZE1pbnV0ZXMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgYW1vdW50OiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGFkZFNlY29uZHMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgYW1vdW50OiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGRpZmZlcmVuY2VJbkRheXMoXG4gICAgZGF0ZUxlZnQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgZGF0ZVJpZ2h0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyXG4gICk6IG51bWJlcjtcblxuICBhYnN0cmFjdCBkaWZmZXJlbmNlSW5NaW51dGVzKFxuICAgIGRhdGVMZWZ0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLFxuICAgIGRhdGVSaWdodDogRGF0ZSB8IHN0cmluZyB8IG51bWJlclxuICApOiBudW1iZXI7XG5cbiAgYWJzdHJhY3QgZGlmZmVyZW5jZUluU2Vjb25kcyhcbiAgICBkYXRlTGVmdDogRGF0ZSB8IHN0cmluZyB8IG51bWJlcixcbiAgICBkYXRlUmlnaHQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXJcbiAgKTogbnVtYmVyO1xuXG4gIGFic3RyYWN0IGVuZE9mRGF5KGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGVuZE9mTW9udGgoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3QgZW5kT2ZXZWVrKFxuICAgIGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgb3B0aW9ucz86IHsgd2Vla1N0YXJ0c09uPzogbnVtYmVyIH1cbiAgKTogRGF0ZTtcblxuICBhYnN0cmFjdCBnZXREYXkoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IG51bWJlcjtcblxuICBhYnN0cmFjdCBpc1NhbWVEYXkoXG4gICAgZGF0ZUxlZnQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgZGF0ZVJpZ2h0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyXG4gICk6IGJvb2xlYW47XG5cbiAgYWJzdHJhY3QgaXNTYW1lTW9udGgoXG4gICAgZGF0ZUxlZnQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgZGF0ZVJpZ2h0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyXG4gICk6IGJvb2xlYW47XG5cbiAgYWJzdHJhY3QgaXNTYW1lU2Vjb25kKFxuICAgIGRhdGVMZWZ0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLFxuICAgIGRhdGVSaWdodDogRGF0ZSB8IHN0cmluZyB8IG51bWJlclxuICApOiBib29sZWFuO1xuXG4gIGFic3RyYWN0IG1heCguLi5kYXRlczogQXJyYXk8RGF0ZSB8IHN0cmluZyB8IG51bWJlcj4pOiBEYXRlO1xuXG4gIGFic3RyYWN0IHNldEhvdXJzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGhvdXJzOiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHNldE1pbnV0ZXMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgbWludXRlczogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzdGFydE9mRGF5KGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHN0YXJ0T2ZNaW51dGUoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3Qgc3RhcnRPZk1vbnRoKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHN0YXJ0T2ZXZWVrKFxuICAgIGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgb3B0aW9ucz86IHsgd2Vla1N0YXJ0c09uPzogbnVtYmVyIH1cbiAgKTogRGF0ZTtcblxuICBhYnN0cmFjdCBnZXRIb3VycyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyO1xuXG4gIGFic3RyYWN0IGdldE1pbnV0ZXMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IG51bWJlcjtcbn1cbiJdfQ==