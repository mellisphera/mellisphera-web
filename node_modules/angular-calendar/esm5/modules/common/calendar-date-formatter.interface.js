/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * The parameter type passed to the date formatter methods.
 * @record
 */
export function DateFormatterParams() { }
/**
 * The date to format.
 * @type {?}
 */
DateFormatterParams.prototype.date;
/**
 * The users preferred locale.
 * @type {?|undefined}
 */
DateFormatterParams.prototype.locale;
/**
 * The start day number of the week
 * @type {?|undefined}
 */
DateFormatterParams.prototype.weekStartsOn;
/**
 * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
 * @type {?|undefined}
 */
DateFormatterParams.prototype.excludeDays;
/**
 * The number of days in a week. Can be used to create a shorter or longer week view.
 * The first day of the week will always be the `viewDate`
 * @type {?|undefined}
 */
DateFormatterParams.prototype.daysInWeek;
/**
 * If using a completely custom date formatter then it should implement this interface.
 * @record
 */
export function CalendarDateFormatterInterface() { }
/**
 * The month view header week day labels
 * @type {?}
 */
CalendarDateFormatterInterface.prototype.monthViewColumnHeader;
/**
 * The month view cell day number
 * @type {?}
 */
CalendarDateFormatterInterface.prototype.monthViewDayNumber;
/**
 * The month view title
 * @type {?}
 */
CalendarDateFormatterInterface.prototype.monthViewTitle;
/**
 * The week view header week day labels
 * @type {?}
 */
CalendarDateFormatterInterface.prototype.weekViewColumnHeader;
/**
 * The week view sub header day and month labels
 * @type {?}
 */
CalendarDateFormatterInterface.prototype.weekViewColumnSubHeader;
/**
 * The week view title
 * @type {?}
 */
CalendarDateFormatterInterface.prototype.weekViewTitle;
/**
 * The time formatting down the left hand side of the day view
 * @type {?}
 */
CalendarDateFormatterInterface.prototype.weekViewHour;
/**
 * The time formatting down the left hand side of the day view
 * @type {?}
 */
CalendarDateFormatterInterface.prototype.dayViewHour;
/**
 * The day view title
 * @type {?}
 */
CalendarDateFormatterInterface.prototype.dayViewTitle;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZGF0ZS1mb3JtYXR0ZXIuaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvY29tbW9uL2NhbGVuZGFyLWRhdGUtZm9ybWF0dGVyLmludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgcGFyYW1ldGVyIHR5cGUgcGFzc2VkIHRvIHRoZSBkYXRlIGZvcm1hdHRlciBtZXRob2RzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIERhdGVGb3JtYXR0ZXJQYXJhbXMge1xuICAvKipcbiAgICogVGhlIGRhdGUgdG8gZm9ybWF0LlxuICAgKi9cbiAgZGF0ZTogRGF0ZTtcblxuICAvKipcbiAgICogVGhlIHVzZXJzIHByZWZlcnJlZCBsb2NhbGUuXG4gICAqL1xuICBsb2NhbGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGFydCBkYXkgbnVtYmVyIG9mIHRoZSB3ZWVrXG4gICAqL1xuICB3ZWVrU3RhcnRzT24/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGRheSBpbmRleGVzICgwID0gc3VuZGF5LCAxID0gbW9uZGF5IGV0YykgdGhhdCB3aWxsIGJlIGhpZGRlbiBvbiB0aGUgdmlld1xuICAgKi9cbiAgZXhjbHVkZURheXM/OiBudW1iZXJbXTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBkYXlzIGluIGEgd2Vlay4gQ2FuIGJlIHVzZWQgdG8gY3JlYXRlIGEgc2hvcnRlciBvciBsb25nZXIgd2VlayB2aWV3LlxuICAgKiBUaGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrIHdpbGwgYWx3YXlzIGJlIHRoZSBgdmlld0RhdGVgXG4gICAqL1xuICBkYXlzSW5XZWVrPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIElmIHVzaW5nIGEgY29tcGxldGVseSBjdXN0b20gZGF0ZSBmb3JtYXR0ZXIgdGhlbiBpdCBzaG91bGQgaW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENhbGVuZGFyRGF0ZUZvcm1hdHRlckludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBUaGUgbW9udGggdmlldyBoZWFkZXIgd2VlayBkYXkgbGFiZWxzXG4gICAqL1xuICBtb250aFZpZXdDb2x1bW5IZWFkZXIoeyBkYXRlOiBEYXRlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtb250aCB2aWV3IGNlbGwgZGF5IG51bWJlclxuICAgKi9cbiAgbW9udGhWaWV3RGF5TnVtYmVyKHsgZGF0ZTogRGF0ZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbW9udGggdmlldyB0aXRsZVxuICAgKi9cbiAgbW9udGhWaWV3VGl0bGUoeyBkYXRlOiBEYXRlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWVrIHZpZXcgaGVhZGVyIHdlZWsgZGF5IGxhYmVsc1xuICAgKi9cbiAgd2Vla1ZpZXdDb2x1bW5IZWFkZXIoeyBkYXRlOiBEYXRlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWVrIHZpZXcgc3ViIGhlYWRlciBkYXkgYW5kIG1vbnRoIGxhYmVsc1xuICAgKi9cbiAgd2Vla1ZpZXdDb2x1bW5TdWJIZWFkZXIoeyBkYXRlOiBEYXRlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWVrIHZpZXcgdGl0bGVcbiAgICovXG4gIHdlZWtWaWV3VGl0bGUoeyBkYXRlOiBEYXRlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIGZvcm1hdHRpbmcgZG93biB0aGUgbGVmdCBoYW5kIHNpZGUgb2YgdGhlIGRheSB2aWV3XG4gICAqL1xuICB3ZWVrVmlld0hvdXIoeyBkYXRlOiBEYXRlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIGZvcm1hdHRpbmcgZG93biB0aGUgbGVmdCBoYW5kIHNpZGUgb2YgdGhlIGRheSB2aWV3XG4gICAqL1xuICBkYXlWaWV3SG91cih7IGRhdGU6IERhdGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRheSB2aWV3IHRpdGxlXG4gICAqL1xuICBkYXlWaWV3VGl0bGUoeyBkYXRlOiBEYXRlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmc7XG59XG4iXX0=