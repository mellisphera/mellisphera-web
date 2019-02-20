(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('calendar-utils'), require('@angular/core'), require('@angular/common'), require('positioning'), require('@angular/animations'), require('angular-draggable-droppable'), require('angular-resizable-element')) :
    typeof define === 'function' && define.amd ? define('angular-calendar', ['exports', 'calendar-utils', '@angular/core', '@angular/common', 'positioning', '@angular/animations', 'angular-draggable-droppable', 'angular-resizable-element'], factory) :
    (factory((global['angular-calendar'] = {}),global.calendarUtils,global.ng.core,global.ng.common,global.positioning,global.ng.animations,global['angular-draggable-droppable'],global['angular-resizable-element']));
}(this, (function (exports,calendarUtils,core,common,positioning,animations,angularDraggableDroppable,angularResizableElement) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
                if (e.indexOf(p[i]) < 0)
                    t[p[i]] = s[p[i]];
        return t;
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var validateEvents = function (events) {
        /** @type {?} */
        var warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return console.warn.apply(console, __spread(['angular-calendar'], args));
        };
        return calendarUtils.validateEvents(events, warn);
    };
    /**
     * @param {?} outer
     * @param {?} inner
     * @return {?}
     */
    function isInside(outer, inner) {
        return (Math.ceil(outer.left) <= Math.ceil(inner.left) &&
            Math.ceil(inner.left) <= Math.ceil(outer.right) &&
            Math.ceil(outer.left) <= Math.ceil(inner.right) &&
            Math.ceil(inner.right) <= Math.ceil(outer.right) &&
            Math.ceil(outer.top) <= Math.ceil(inner.top) &&
            Math.ceil(inner.top) <= Math.ceil(outer.bottom) &&
            Math.ceil(outer.top) <= Math.ceil(inner.bottom) &&
            Math.ceil(inner.bottom) <= Math.ceil(outer.bottom));
    }
    /**
     * @param {?} amount
     * @param {?} precision
     * @return {?}
     */
    function roundToNearest(amount, precision) {
        return Math.round(amount / precision) * precision;
    }
    /** @type {?} */
    var trackByEventId = function (index, event) {
        return event.id ? event.id : event;
    };
    /** @type {?} */
    var trackByWeekDayHeaderDate = function (index, day) {
        return day.date.toISOString();
    };
    /** @type {?} */
    var trackByIndex = function (index) { return index; };
    /** @type {?} */
    var trackByHourSegment = function (index, segment) { return segment.date.toISOString(); };
    /** @type {?} */
    var trackByHour = function (index, hour) {
        return hour.segments[0].date.toISOString();
    };
    /** @type {?} */
    var trackByDayOrWeekEvent = function (index, weekEvent) { return (weekEvent.event.id ? weekEvent.event.id : weekEvent.event); };
    /** @type {?} */
    var MINUTES_IN_HOUR = 60;
    /**
     * @param {?} movedY
     * @param {?} hourSegments
     * @param {?} hourSegmentHeight
     * @param {?} eventSnapSize
     * @return {?}
     */
    function getMinutesMoved(movedY, hourSegments, hourSegmentHeight, eventSnapSize) {
        /** @type {?} */
        var draggedInPixelsSnapSize = roundToNearest(movedY, eventSnapSize || hourSegmentHeight);
        /** @type {?} */
        var pixelAmountInMinutes = MINUTES_IN_HOUR / (hourSegments * hourSegmentHeight);
        return draggedInPixelsSnapSize * pixelAmountInMinutes;
    }
    /**
     * @param {?} hourSegments
     * @param {?} hourSegmentHeight
     * @return {?}
     */
    function getMinimumEventHeightInMinutes(hourSegments, hourSegmentHeight) {
        return (MINUTES_IN_HOUR / (hourSegments * hourSegmentHeight)) * 30;
    }
    /**
     * @param {?} dateAdapter
     * @param {?} event
     * @param {?} minimumMinutes
     * @return {?}
     */
    function getDefaultEventEnd(dateAdapter, event, minimumMinutes) {
        if (event.end) {
            return event.end;
        }
        else {
            return dateAdapter.addMinutes(event.start, minimumMinutes);
        }
    }
    /**
     * @param {?} dateAdapter
     * @param {?} date
     * @param {?} days
     * @param {?} excluded
     * @return {?}
     */
    function addDaysWithExclusions(dateAdapter, date, days, excluded) {
        /** @type {?} */
        var daysCounter = 0;
        /** @type {?} */
        var daysToAdd = 0;
        /** @type {?} */
        var changeDays = days < 0 ? dateAdapter.subDays : dateAdapter.addDays;
        /** @type {?} */
        var result = date;
        while (daysToAdd <= Math.abs(days)) {
            result = changeDays(date, daysCounter);
            /** @type {?} */
            var day = dateAdapter.getDay(result);
            if (excluded.indexOf(day) === -1) {
                daysToAdd++;
            }
            daysCounter++;
        }
        return result;
    }
    /**
     * @param {?} newStart
     * @param {?} newEnd
     * @param {?} period
     * @return {?}
     */
    function isDraggedWithinPeriod(newStart, newEnd, period) {
        /** @type {?} */
        var end = newEnd || newStart;
        return ((period.start <= newStart && newStart <= period.end) ||
            (period.start <= end && end <= period.end));
    }
    /**
     * @param {?} dropEvent
     * @param {?} date
     * @param {?} allDay
     * @param {?} calendarId
     * @return {?}
     */
    function shouldFireDroppedEvent(dropEvent, date, allDay, calendarId) {
        return (dropEvent.dropData &&
            dropEvent.dropData.event &&
            (dropEvent.dropData.calendarId !== calendarId ||
                (dropEvent.dropData.event.allDay && !allDay) ||
                (!dropEvent.dropData.event.allDay && allDay)));
    }
    /**
     * @param {?} dateAdapter
     * @param {?} viewDate
     * @param {?} weekStartsOn
     * @param {?=} excluded
     * @param {?=} daysInWeek
     * @return {?}
     */
    function getWeekViewPeriod(dateAdapter, viewDate, weekStartsOn, excluded, daysInWeek) {
        if (excluded === void 0) {
            excluded = [];
        }
        /** @type {?} */
        var viewStart = daysInWeek
            ? dateAdapter.startOfDay(viewDate)
            : dateAdapter.startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        if (excluded.indexOf(dateAdapter.getDay(viewStart)) > -1) {
            viewStart = dateAdapter.subDays(addDaysWithExclusions(dateAdapter, viewStart, 1, excluded), 1);
        }
        if (daysInWeek) {
            /** @type {?} */
            var viewEnd = dateAdapter.endOfDay(addDaysWithExclusions(dateAdapter, viewStart, daysInWeek - 1, excluded));
            return { viewStart: viewStart, viewEnd: viewEnd };
        }
        else {
            /** @type {?} */
            var viewEnd = dateAdapter.endOfWeek(viewDate, { weekStartsOn: weekStartsOn });
            if (excluded.indexOf(dateAdapter.getDay(viewEnd)) > -1) {
                viewEnd = dateAdapter.addDays(addDaysWithExclusions(dateAdapter, viewEnd, -1, excluded), 1);
            }
            return { viewStart: viewStart, viewEnd: viewEnd };
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarEventActionsComponent = /** @class */ (function () {
        function CalendarEventActionsComponent() {
            this.trackByIndex = trackByIndex;
        }
        CalendarEventActionsComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-event-actions',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-event=\"event\">\n      <span *ngIf=\"event.actions\" class=\"cal-event-actions\">\n        <a\n          class=\"cal-event-action\"\n          href=\"javascript:;\"\n          *ngFor=\"let action of event.actions; trackBy:trackByIndex\"\n          (mwlClick)=\"action.onClick({event: event})\"\n          [ngClass]=\"action.cssClass\"\n          [innerHtml]=\"action.label\">\n        </a>\n      </span>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        event: event\n      }\">\n    </ng-template>\n  "
                    }] }
        ];
        CalendarEventActionsComponent.propDecorators = {
            event: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }]
        };
        return CalendarEventActionsComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarEventTitleComponent = /** @class */ (function () {
        function CalendarEventTitleComponent() {
        }
        CalendarEventTitleComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-event-title',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-event=\"event\"\n      let-view=\"view\">\n      <span\n        class=\"cal-event-title\"\n        [innerHTML]=\"event.title | calendarEventTitle:view:event\">\n      </span>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        event: event,\n        view: view\n      }\">\n    </ng-template>\n  "
                    }] }
        ];
        CalendarEventTitleComponent.propDecorators = {
            event: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }],
            view: [{ type: core.Input }]
        };
        return CalendarEventTitleComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarTooltipWindowComponent = /** @class */ (function () {
        function CalendarTooltipWindowComponent() {
        }
        CalendarTooltipWindowComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-tooltip-window',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-contents=\"contents\"\n      let-placement=\"placement\"\n      let-event=\"event\">\n      <div class=\"cal-tooltip\" [ngClass]=\"'cal-tooltip-' + placement\">\n        <div class=\"cal-tooltip-arrow\"></div>\n        <div class=\"cal-tooltip-inner\" [innerHtml]=\"contents\"></div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        contents: contents,\n        placement: placement,\n        event: event\n      }\">\n    </ng-template>\n  "
                    }] }
        ];
        CalendarTooltipWindowComponent.propDecorators = {
            contents: [{ type: core.Input }],
            placement: [{ type: core.Input }],
            event: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }]
        };
        return CalendarTooltipWindowComponent;
    }());
    var CalendarTooltipDirective = /** @class */ (function () {
        function CalendarTooltipDirective(elementRef, injector, renderer, componentFactoryResolver, viewContainerRef, document //tslint:disable-line
        //tslint:disable-line
        ) {
            this.elementRef = elementRef;
            this.injector = injector;
            this.renderer = renderer;
            this.viewContainerRef = viewContainerRef;
            this.document //tslint:disable-line
                = document;
            this.placement = 'auto';
            this.tooltipFactory = componentFactoryResolver.resolveComponentFactory(CalendarTooltipWindowComponent);
        }
        /**
         * @return {?}
         */
        CalendarTooltipDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.hide();
            };
        /**
         * @return {?}
         */
        CalendarTooltipDirective.prototype.onMouseOver = /**
         * @return {?}
         */
            function () {
                this.show();
            };
        /**
         * @return {?}
         */
        CalendarTooltipDirective.prototype.onMouseOut = /**
         * @return {?}
         */
            function () {
                this.hide();
            };
        /**
         * @return {?}
         */
        CalendarTooltipDirective.prototype.show = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (!this.tooltipRef && this.contents) {
                    this.tooltipRef = this.viewContainerRef.createComponent(this.tooltipFactory, 0, this.injector, []);
                    this.tooltipRef.instance.contents = this.contents;
                    this.tooltipRef.instance.customTemplate = this.customTemplate;
                    this.tooltipRef.instance.event = this.event;
                    if (this.appendToBody) {
                        this.document.body.appendChild(this.tooltipRef.location.nativeElement);
                    }
                    requestAnimationFrame(function () {
                        _this.positionTooltip();
                    });
                }
            };
        /**
         * @return {?}
         */
        CalendarTooltipDirective.prototype.hide = /**
         * @return {?}
         */
            function () {
                if (this.tooltipRef) {
                    this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.tooltipRef.hostView));
                    this.tooltipRef = null;
                }
            };
        /**
         * @param {?=} previousPosition
         * @return {?}
         */
        CalendarTooltipDirective.prototype.positionTooltip = /**
         * @param {?=} previousPosition
         * @return {?}
         */
            function (previousPosition) {
                if (this.tooltipRef) {
                    this.tooltipRef.changeDetectorRef.detectChanges();
                    this.tooltipRef.instance.placement = positioning.positionElements(this.elementRef.nativeElement, this.tooltipRef.location.nativeElement.children[0], this.placement, this.appendToBody);
                    // keep re-positioning the tooltip until the arrow position doesn't make a difference
                    if (previousPosition !== this.tooltipRef.instance.placement) {
                        this.positionTooltip(this.tooltipRef.instance.placement);
                    }
                }
            };
        CalendarTooltipDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[mwlCalendarTooltip]'
                    },] }
        ];
        /** @nocollapse */
        CalendarTooltipDirective.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.Injector },
                { type: core.Renderer2 },
                { type: core.ComponentFactoryResolver },
                { type: core.ViewContainerRef },
                { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] }] }
            ];
        };
        CalendarTooltipDirective.propDecorators = {
            contents: [{ type: core.Input, args: ['mwlCalendarTooltip',] }],
            placement: [{ type: core.Input, args: ['tooltipPlacement',] }],
            customTemplate: [{ type: core.Input, args: ['tooltipTemplate',] }],
            event: [{ type: core.Input, args: ['tooltipEvent',] }],
            appendToBody: [{ type: core.Input, args: ['tooltipAppendToBody',] }],
            onMouseOver: [{ type: core.HostListener, args: ['mouseenter',] }],
            onMouseOut: [{ type: core.HostListener, args: ['mouseleave',] }]
        };
        return CalendarTooltipDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * @abstract
     */
    var /**
     * @abstract
     */ DateAdapter = /** @class */ (function () {
        function DateAdapter() {
        }
        return DateAdapter;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @enum {string} */
    var CalendarView = {
        Month: 'month',
        Week: 'week',
        Day: 'day',
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Change the view date to the previous view. For example:
     *
     * ```typescript
     * <button
     *  mwlCalendarPreviousView
     *  [(viewDate)]="viewDate"
     *  [view]="view">
     *  Previous
     * </button>
     * ```
     */
    var CalendarPreviousViewDirective = /** @class */ (function () {
        function CalendarPreviousViewDirective(dateAdapter) {
            this.dateAdapter = dateAdapter;
            /**
             * Days to skip when going back by 1 day
             */
            this.excludeDays = [];
            /**
             * Called when the view date is changed
             */
            this.viewDateChange = new core.EventEmitter();
        }
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarPreviousViewDirective.prototype.onClick = /**
         * @hidden
         * @return {?}
         */
            function () {
                /** @type {?} */
                var subFn = {
                    day: this.dateAdapter.subDays,
                    week: this.dateAdapter.subWeeks,
                    month: this.dateAdapter.subMonths
                }[this.view];
                if (this.view === CalendarView.Day) {
                    this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -1, this.excludeDays));
                }
                else if (this.view === CalendarView.Week && this.daysInWeek) {
                    this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -this.daysInWeek, this.excludeDays));
                }
                else {
                    this.viewDateChange.emit(subFn(this.viewDate, 1));
                }
            };
        CalendarPreviousViewDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[mwlCalendarPreviousView]'
                    },] }
        ];
        /** @nocollapse */
        CalendarPreviousViewDirective.ctorParameters = function () {
            return [
                { type: DateAdapter }
            ];
        };
        CalendarPreviousViewDirective.propDecorators = {
            view: [{ type: core.Input }],
            viewDate: [{ type: core.Input }],
            excludeDays: [{ type: core.Input }],
            daysInWeek: [{ type: core.Input }],
            viewDateChange: [{ type: core.Output }],
            onClick: [{ type: core.HostListener, args: ['click',] }]
        };
        return CalendarPreviousViewDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Change the view date to the next view. For example:
     *
     * ```typescript
     * <button
     *  mwlCalendarNextView
     *  [(viewDate)]="viewDate"
     *  [view]="view">
     *  Next
     * </button>
     * ```
     */
    var CalendarNextViewDirective = /** @class */ (function () {
        function CalendarNextViewDirective(dateAdapter) {
            this.dateAdapter = dateAdapter;
            /**
             * Days to skip when going forward by 1 day
             */
            this.excludeDays = [];
            /**
             * Called when the view date is changed
             */
            this.viewDateChange = new core.EventEmitter();
        }
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarNextViewDirective.prototype.onClick = /**
         * @hidden
         * @return {?}
         */
            function () {
                /** @type {?} */
                var addFn = {
                    day: this.dateAdapter.addDays,
                    week: this.dateAdapter.addWeeks,
                    month: this.dateAdapter.addMonths
                }[this.view];
                if (this.view === CalendarView.Day) {
                    this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, 1, this.excludeDays));
                }
                else if (this.view === CalendarView.Week && this.daysInWeek) {
                    this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, this.daysInWeek, this.excludeDays));
                }
                else {
                    this.viewDateChange.emit(addFn(this.viewDate, 1));
                }
            };
        CalendarNextViewDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[mwlCalendarNextView]'
                    },] }
        ];
        /** @nocollapse */
        CalendarNextViewDirective.ctorParameters = function () {
            return [
                { type: DateAdapter }
            ];
        };
        CalendarNextViewDirective.propDecorators = {
            view: [{ type: core.Input }],
            viewDate: [{ type: core.Input }],
            excludeDays: [{ type: core.Input }],
            daysInWeek: [{ type: core.Input }],
            viewDateChange: [{ type: core.Output }],
            onClick: [{ type: core.HostListener, args: ['click',] }]
        };
        return CalendarNextViewDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
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
            this.viewDateChange = new core.EventEmitter();
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
            { type: core.Directive, args: [{
                        selector: '[mwlCalendarToday]'
                    },] }
        ];
        /** @nocollapse */
        CalendarTodayDirective.ctorParameters = function () {
            return [
                { type: DateAdapter }
            ];
        };
        CalendarTodayDirective.propDecorators = {
            viewDate: [{ type: core.Input }],
            viewDateChange: [{ type: core.Output }],
            onClick: [{ type: core.HostListener, args: ['click',] }]
        };
        return CalendarTodayDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * This will use the angular date pipe to do all date formatting. It is the default date formatter used by the calendar.
     */
    var CalendarAngularDateFormatter = /** @class */ (function () {
        function CalendarAngularDateFormatter(dateAdapter) {
            this.dateAdapter = dateAdapter;
        }
        /**
         * The month view header week day labels
         * @param {?} __0
         * @return {?}
         */
        CalendarAngularDateFormatter.prototype.monthViewColumnHeader = /**
         * The month view header week day labels
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return common.formatDate(date, 'EEEE', locale);
            };
        /**
         * The month view cell day number
         * @param {?} __0
         * @return {?}
         */
        CalendarAngularDateFormatter.prototype.monthViewDayNumber = /**
         * The month view cell day number
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return common.formatDate(date, 'd', locale);
            };
        /**
         * The month view title
         * @param {?} __0
         * @return {?}
         */
        CalendarAngularDateFormatter.prototype.monthViewTitle = /**
         * The month view title
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return common.formatDate(date, 'LLLL y', locale);
            };
        /**
         * The week view header week day labels
         * @param {?} __0
         * @return {?}
         */
        CalendarAngularDateFormatter.prototype.weekViewColumnHeader = /**
         * The week view header week day labels
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return common.formatDate(date, 'EEEE', locale);
            };
        /**
         * The week view sub header day and month labels
         * @param {?} __0
         * @return {?}
         */
        CalendarAngularDateFormatter.prototype.weekViewColumnSubHeader = /**
         * The week view sub header day and month labels
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return common.formatDate(date, 'MMM d', locale);
            };
        /**
         * The week view title
         * @param {?} __0
         * @return {?}
         */
        CalendarAngularDateFormatter.prototype.weekViewTitle = /**
         * The week view title
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale, weekStartsOn = _a.weekStartsOn, excludeDays = _a.excludeDays, daysInWeek = _a.daysInWeek;
                var _b = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek), viewStart = _b.viewStart, viewEnd = _b.viewEnd;
                /** @type {?} */
                var format = function (dateToFormat, showYear) {
                    return common.formatDate(dateToFormat, 'MMM d' + (showYear ? ', yyyy' : ''), locale);
                };
                return format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear()) + " - " + format(viewEnd, true);
            };
        /**
         * The time formatting down the left hand side of the week view
         * @param {?} __0
         * @return {?}
         */
        CalendarAngularDateFormatter.prototype.weekViewHour = /**
         * The time formatting down the left hand side of the week view
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return common.formatDate(date, 'h a', locale);
            };
        /**
         * The time formatting down the left hand side of the day view
         * @param {?} __0
         * @return {?}
         */
        CalendarAngularDateFormatter.prototype.dayViewHour = /**
         * The time formatting down the left hand side of the day view
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return common.formatDate(date, 'h a', locale);
            };
        /**
         * The day view title
         * @param {?} __0
         * @return {?}
         */
        CalendarAngularDateFormatter.prototype.dayViewTitle = /**
         * The day view title
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return common.formatDate(date, 'EEEE, MMMM d, y', locale);
            };
        CalendarAngularDateFormatter.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CalendarAngularDateFormatter.ctorParameters = function () {
            return [
                { type: DateAdapter }
            ];
        };
        return CalendarAngularDateFormatter;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * This class is responsible for all formatting of dates. There are 3 implementations available, the `CalendarAngularDateFormatter` (default) which uses the angular date pipe to format dates, the `CalendarNativeDateFormatter` which will use the <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to format dates, or there is the `CalendarMomentDateFormatter` which uses <a href="http://momentjs.com/" target="_blank">moment</a>.
     *
     * If you wish, you may override any of the defaults via angulars DI. For example:
     *
     * ```typescript
     * import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
     * import { formatDate } from '\@angular/common';
     *
     * class CustomDateFormatter extends CalendarDateFormatter {
     *
     *   public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
     *     return formatDate(date, 'EEE', locale); // use short week days
     *   }
     *
     * }
     *
     * // in your component that uses the calendar
     * providers: [{
     *   provide: CalendarDateFormatter,
     *   useClass: CustomDateFormatter
     * }]
     * ```
     */
    var CalendarDateFormatter = /** @class */ (function (_super) {
        __extends(CalendarDateFormatter, _super);
        function CalendarDateFormatter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CalendarDateFormatter.decorators = [
            { type: core.Injectable }
        ];
        return CalendarDateFormatter;
    }(CalendarAngularDateFormatter));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * This pipe is primarily for rendering the current view title. Example usage:
     * ```typescript
     * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
     * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
     * ```
     */
    var CalendarDatePipe = /** @class */ (function () {
        function CalendarDatePipe(dateFormatter, locale) {
            this.dateFormatter = dateFormatter;
            this.locale = locale;
        }
        /**
         * @param {?} date
         * @param {?} method
         * @param {?=} locale
         * @param {?=} weekStartsOn
         * @param {?=} excludeDays
         * @param {?=} daysInWeek
         * @return {?}
         */
        CalendarDatePipe.prototype.transform = /**
         * @param {?} date
         * @param {?} method
         * @param {?=} locale
         * @param {?=} weekStartsOn
         * @param {?=} excludeDays
         * @param {?=} daysInWeek
         * @return {?}
         */
            function (date, method, locale, weekStartsOn, excludeDays, daysInWeek) {
                if (locale === void 0) {
                    locale = this.locale;
                }
                if (weekStartsOn === void 0) {
                    weekStartsOn = 0;
                }
                if (excludeDays === void 0) {
                    excludeDays = [];
                }
                return this.dateFormatter[method]({
                    date: date,
                    locale: locale,
                    weekStartsOn: weekStartsOn,
                    excludeDays: excludeDays,
                    daysInWeek: daysInWeek
                });
            };
        CalendarDatePipe.decorators = [
            { type: core.Pipe, args: [{
                        name: 'calendarDate'
                    },] }
        ];
        /** @nocollapse */
        CalendarDatePipe.ctorParameters = function () {
            return [
                { type: CalendarDateFormatter },
                { type: String, decorators: [{ type: core.Inject, args: [core.LOCALE_ID,] }] }
            ];
        };
        return CalendarDatePipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * This class is responsible for displaying all event titles within the calendar. You may override any of its methods via angulars DI to suit your requirements. For example:
     *
     * ```typescript
     * import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
     *
     * class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
     *
     *   month(event: CalendarEvent): string {
     *     return `Custom prefix: ${event.title}`;
     *   }
     *
     * }
     *
     * // in your component
     * providers: [{
     *  provide: CalendarEventTitleFormatter,
     *  useClass: CustomEventTitleFormatter
     * }]
     * ```
     */
    var /**
     * This class is responsible for displaying all event titles within the calendar. You may override any of its methods via angulars DI to suit your requirements. For example:
     *
     * ```typescript
     * import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
     *
     * class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
     *
     *   month(event: CalendarEvent): string {
     *     return `Custom prefix: ${event.title}`;
     *   }
     *
     * }
     *
     * // in your component
     * providers: [{
     *  provide: CalendarEventTitleFormatter,
     *  useClass: CustomEventTitleFormatter
     * }]
     * ```
     */ CalendarEventTitleFormatter = /** @class */ (function () {
        function CalendarEventTitleFormatter() {
        }
        /**
         * The month view event title.
         */
        /**
         * The month view event title.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
        CalendarEventTitleFormatter.prototype.month = /**
         * The month view event title.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
            function (event, title) {
                return event.title;
            };
        /**
         * The month view event tooltip. Return a falsey value from this to disable the tooltip.
         */
        /**
         * The month view event tooltip. Return a falsey value from this to disable the tooltip.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
        CalendarEventTitleFormatter.prototype.monthTooltip = /**
         * The month view event tooltip. Return a falsey value from this to disable the tooltip.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
            function (event, title) {
                return event.title;
            };
        /**
         * The week view event title.
         */
        /**
         * The week view event title.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
        CalendarEventTitleFormatter.prototype.week = /**
         * The week view event title.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
            function (event, title) {
                return event.title;
            };
        /**
         * The week view event tooltip. Return a falsey value from this to disable the tooltip.
         */
        /**
         * The week view event tooltip. Return a falsey value from this to disable the tooltip.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
        CalendarEventTitleFormatter.prototype.weekTooltip = /**
         * The week view event tooltip. Return a falsey value from this to disable the tooltip.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
            function (event, title) {
                return event.title;
            };
        /**
         * The day view event title.
         */
        /**
         * The day view event title.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
        CalendarEventTitleFormatter.prototype.day = /**
         * The day view event title.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
            function (event, title) {
                return event.title;
            };
        /**
         * The day view event tooltip. Return a falsey value from this to disable the tooltip.
         */
        /**
         * The day view event tooltip. Return a falsey value from this to disable the tooltip.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
        CalendarEventTitleFormatter.prototype.dayTooltip = /**
         * The day view event tooltip. Return a falsey value from this to disable the tooltip.
         * @param {?} event
         * @param {?} title
         * @return {?}
         */
            function (event, title) {
                return event.title;
            };
        return CalendarEventTitleFormatter;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarEventTitlePipe = /** @class */ (function () {
        function CalendarEventTitlePipe(calendarEventTitle) {
            this.calendarEventTitle = calendarEventTitle;
        }
        /**
         * @param {?} title
         * @param {?} titleType
         * @param {?} event
         * @return {?}
         */
        CalendarEventTitlePipe.prototype.transform = /**
         * @param {?} title
         * @param {?} titleType
         * @param {?} event
         * @return {?}
         */
            function (title, titleType, event) {
                return this.calendarEventTitle[titleType](event, title);
            };
        CalendarEventTitlePipe.decorators = [
            { type: core.Pipe, args: [{
                        name: 'calendarEventTitle'
                    },] }
        ];
        /** @nocollapse */
        CalendarEventTitlePipe.ctorParameters = function () {
            return [
                { type: CalendarEventTitleFormatter }
            ];
        };
        return CalendarEventTitlePipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var clickElements = new Set();
    var ClickDirective = /** @class */ (function () {
        function ClickDirective(renderer, elm, document) {
            this.renderer = renderer;
            this.elm = elm;
            this.document = document;
            this.click = new core.EventEmitter();
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
            { type: core.Directive, args: [{
                        selector: '[mwlClick]'
                    },] }
        ];
        /** @nocollapse */
        ClickDirective.ctorParameters = function () {
            return [
                { type: core.Renderer2 },
                { type: core.ElementRef },
                { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] }] }
            ];
        };
        ClickDirective.propDecorators = {
            click: [{ type: core.Output, args: ['mwlClick',] }]
        };
        return ClickDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarUtils = /** @class */ (function () {
        function CalendarUtils(dateAdapter) {
            this.dateAdapter = dateAdapter;
        }
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarUtils.prototype.getMonthView = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                return calendarUtils.getMonthView(this.dateAdapter, args);
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarUtils.prototype.getWeekViewHeader = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                return calendarUtils.getWeekViewHeader(this.dateAdapter, args);
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarUtils.prototype.getWeekView = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                return calendarUtils.getWeekView(this.dateAdapter, args);
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarUtils.prototype.getDayView = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                return calendarUtils.getDayView(this.dateAdapter, args);
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarUtils.prototype.getDayViewHourGrid = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                return calendarUtils.getDayViewHourGrid(this.dateAdapter, args);
            };
        CalendarUtils.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CalendarUtils.ctorParameters = function () {
            return [
                { type: DateAdapter }
            ];
        };
        return CalendarUtils;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var MOMENT = new core.InjectionToken('Moment');
    /**
     * This will use <a href="http://momentjs.com/" target="_blank">moment</a> to do all date formatting. To use this class:
     *
     * ```typescript
     * import { CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
     * import moment from 'moment';
     *
     * // in your component
     * provide: [{
     *   provide: MOMENT, useValue: moment
     * }, {
     *   provide: CalendarDateFormatter, useClass: CalendarMomentDateFormatter
     * }]
     *
     * ```
     */
    var CalendarMomentDateFormatter = /** @class */ (function () {
        /**
         * @hidden
         */
        function CalendarMomentDateFormatter(moment, dateAdapter) {
            this.moment = moment;
            this.dateAdapter = dateAdapter;
        }
        /**
         * The month view header week day labels
         * @param {?} __0
         * @return {?}
         */
        CalendarMomentDateFormatter.prototype.monthViewColumnHeader = /**
         * The month view header week day labels
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return this.moment(date)
                    .locale(locale)
                    .format('dddd');
            };
        /**
         * The month view cell day number
         * @param {?} __0
         * @return {?}
         */
        CalendarMomentDateFormatter.prototype.monthViewDayNumber = /**
         * The month view cell day number
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return this.moment(date)
                    .locale(locale)
                    .format('D');
            };
        /**
         * The month view title
         * @param {?} __0
         * @return {?}
         */
        CalendarMomentDateFormatter.prototype.monthViewTitle = /**
         * The month view title
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return this.moment(date)
                    .locale(locale)
                    .format('MMMM YYYY');
            };
        /**
         * The week view header week day labels
         * @param {?} __0
         * @return {?}
         */
        CalendarMomentDateFormatter.prototype.weekViewColumnHeader = /**
         * The week view header week day labels
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return this.moment(date)
                    .locale(locale)
                    .format('dddd');
            };
        /**
         * The week view sub header day and month labels
         * @param {?} __0
         * @return {?}
         */
        CalendarMomentDateFormatter.prototype.weekViewColumnSubHeader = /**
         * The week view sub header day and month labels
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return this.moment(date)
                    .locale(locale)
                    .format('MMM D');
            };
        /**
         * The week view title
         * @param {?} __0
         * @return {?}
         */
        CalendarMomentDateFormatter.prototype.weekViewTitle = /**
         * The week view title
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var _this = this;
                var date = _a.date, locale = _a.locale, weekStartsOn = _a.weekStartsOn, excludeDays = _a.excludeDays, daysInWeek = _a.daysInWeek;
                var _b = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek), viewStart = _b.viewStart, viewEnd = _b.viewEnd;
                /** @type {?} */
                var format = function (dateToFormat, showYear) {
                    return _this.moment(dateToFormat)
                        .locale(locale)
                        .format('MMM D' + (showYear ? ', YYYY' : ''));
                };
                return format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear()) + " - " + format(viewEnd, true);
            };
        /**
         * The time formatting down the left hand side of the week view
         * @param {?} __0
         * @return {?}
         */
        CalendarMomentDateFormatter.prototype.weekViewHour = /**
         * The time formatting down the left hand side of the week view
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return this.moment(date)
                    .locale(locale)
                    .format('ha');
            };
        /**
         * The time formatting down the left hand side of the day view
         * @param {?} __0
         * @return {?}
         */
        CalendarMomentDateFormatter.prototype.dayViewHour = /**
         * The time formatting down the left hand side of the day view
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return this.moment(date)
                    .locale(locale)
                    .format('ha');
            };
        /**
         * The day view title
         * @param {?} __0
         * @return {?}
         */
        CalendarMomentDateFormatter.prototype.dayViewTitle = /**
         * The day view title
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return this.moment(date)
                    .locale(locale)
                    .format('dddd, D MMMM, YYYY');
            };
        CalendarMomentDateFormatter.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CalendarMomentDateFormatter.ctorParameters = function () {
            return [
                { type: undefined, decorators: [{ type: core.Inject, args: [MOMENT,] }] },
                { type: DateAdapter }
            ];
        };
        return CalendarMomentDateFormatter;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * This will use <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to do all date formatting.
     *
     * You will need to include a <a href="https://github.com/andyearnshaw/Intl.js/">polyfill</a> for older browsers.
     */
    var CalendarNativeDateFormatter = /** @class */ (function () {
        function CalendarNativeDateFormatter(dateAdapter) {
            this.dateAdapter = dateAdapter;
        }
        /**
         * The month view header week day labels
         * @param {?} __0
         * @return {?}
         */
        CalendarNativeDateFormatter.prototype.monthViewColumnHeader = /**
         * The month view header week day labels
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
            };
        /**
         * The month view cell day number
         * @param {?} __0
         * @return {?}
         */
        CalendarNativeDateFormatter.prototype.monthViewDayNumber = /**
         * The month view cell day number
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(date);
            };
        /**
         * The month view title
         * @param {?} __0
         * @return {?}
         */
        CalendarNativeDateFormatter.prototype.monthViewTitle = /**
         * The month view title
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return new Intl.DateTimeFormat(locale, {
                    year: 'numeric',
                    month: 'long'
                }).format(date);
            };
        /**
         * The week view header week day labels
         * @param {?} __0
         * @return {?}
         */
        CalendarNativeDateFormatter.prototype.weekViewColumnHeader = /**
         * The week view header week day labels
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
            };
        /**
         * The week view sub header day and month labels
         * @param {?} __0
         * @return {?}
         */
        CalendarNativeDateFormatter.prototype.weekViewColumnSubHeader = /**
         * The week view sub header day and month labels
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return new Intl.DateTimeFormat(locale, {
                    day: 'numeric',
                    month: 'short'
                }).format(date);
            };
        /**
         * The week view title
         * @param {?} __0
         * @return {?}
         */
        CalendarNativeDateFormatter.prototype.weekViewTitle = /**
         * The week view title
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale, weekStartsOn = _a.weekStartsOn, excludeDays = _a.excludeDays, daysInWeek = _a.daysInWeek;
                var _b = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek), viewStart = _b.viewStart, viewEnd = _b.viewEnd;
                /** @type {?} */
                var format = function (dateToFormat, showYear) {
                    return new Intl.DateTimeFormat(locale, {
                        day: 'numeric',
                        month: 'short',
                        year: showYear ? 'numeric' : undefined
                    }).format(dateToFormat);
                };
                return format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear()) + " - " + format(viewEnd, true);
            };
        /**
         * The time formatting down the left hand side of the week view
         * @param {?} __0
         * @return {?}
         */
        CalendarNativeDateFormatter.prototype.weekViewHour = /**
         * The time formatting down the left hand side of the week view
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(date);
            };
        /**
         * The time formatting down the left hand side of the day view
         * @param {?} __0
         * @return {?}
         */
        CalendarNativeDateFormatter.prototype.dayViewHour = /**
         * The time formatting down the left hand side of the day view
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(date);
            };
        /**
         * The day view title
         * @param {?} __0
         * @return {?}
         */
        CalendarNativeDateFormatter.prototype.dayViewTitle = /**
         * The day view title
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return new Intl.DateTimeFormat(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    weekday: 'long'
                }).format(date);
            };
        CalendarNativeDateFormatter.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CalendarNativeDateFormatter.ctorParameters = function () {
            return [
                { type: DateAdapter }
            ];
        };
        return CalendarNativeDateFormatter;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @enum {string} */
    var CalendarEventTimesChangedEventType = {
        Drag: 'drag',
        Drop: 'drop',
        Resize: 'resize',
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Import this module to if you're just using a singular view and want to save on bundle size. Example usage:
     *
     * ```typescript
     * import { CalendarCommonModule, CalendarMonthModule } from 'angular-calendar';
     *
     * \@NgModule({
     *   imports: [
     *     CalendarCommonModule.forRoot(),
     *     CalendarMonthModule
     *   ]
     * })
     * class MyModule {}
     * ```
     *
     */
    var CalendarCommonModule = /** @class */ (function () {
        function CalendarCommonModule() {
        }
        /**
         * @param {?} dateAdapter
         * @param {?=} config
         * @return {?}
         */
        CalendarCommonModule.forRoot = /**
         * @param {?} dateAdapter
         * @param {?=} config
         * @return {?}
         */
            function (dateAdapter, config) {
                if (config === void 0) {
                    config = {};
                }
                return {
                    ngModule: CalendarCommonModule,
                    providers: [
                        dateAdapter,
                        config.eventTitleFormatter || CalendarEventTitleFormatter,
                        config.dateFormatter || CalendarDateFormatter,
                        config.utils || CalendarUtils
                    ]
                };
            };
        CalendarCommonModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            CalendarEventActionsComponent,
                            CalendarEventTitleComponent,
                            CalendarTooltipWindowComponent,
                            CalendarTooltipDirective,
                            CalendarPreviousViewDirective,
                            CalendarNextViewDirective,
                            CalendarTodayDirective,
                            CalendarDatePipe,
                            CalendarEventTitlePipe,
                            ClickDirective
                        ],
                        imports: [common.CommonModule],
                        exports: [
                            CalendarEventActionsComponent,
                            CalendarEventTitleComponent,
                            CalendarTooltipWindowComponent,
                            CalendarTooltipDirective,
                            CalendarPreviousViewDirective,
                            CalendarNextViewDirective,
                            CalendarTodayDirective,
                            CalendarDatePipe,
                            CalendarEventTitlePipe,
                            ClickDirective
                        ],
                        entryComponents: [CalendarTooltipWindowComponent]
                    },] }
        ];
        return CalendarCommonModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Shows all events on a given month. Example usage:
     *
     * ```typescript
     * <mwl-calendar-month-view
     *  [viewDate]="viewDate"
     *  [events]="events">
     * </mwl-calendar-month-view>
     * ```
     */
    var CalendarMonthViewComponent = /** @class */ (function () {
        /**
         * @hidden
         */
        function CalendarMonthViewComponent(cdr, utils, locale, dateAdapter) {
            this.cdr = cdr;
            this.utils = utils;
            this.dateAdapter = dateAdapter;
            /**
             * An array of events to display on view.
             * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
             */
            this.events = [];
            /**
             * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
             */
            this.excludeDays = [];
            /**
             * Whether the events list for the day of the `viewDate` option is visible or not
             */
            this.activeDayIsOpen = false;
            /**
             * The placement of the event tooltip
             */
            this.tooltipPlacement = 'auto';
            /**
             * Whether to append tooltips to the body or next to the trigger element
             */
            this.tooltipAppendToBody = true;
            /**
             * An output that will be called before the view is rendered for the current month.
             * If you add the `cssClass` property to a day in the body it will add that class to the cell element in the template
             */
            this.beforeViewRender = new core.EventEmitter();
            /**
             * Called when the day cell is clicked
             */
            this.dayClicked = new core.EventEmitter();
            /**
             * Called when the event title is clicked
             */
            this.eventClicked = new core.EventEmitter();
            /**
             * Called when an event is dragged and dropped
             */
            this.eventTimesChanged = new core.EventEmitter();
            /**
             * @hidden
             */
            this.trackByIndex = trackByIndex;
            /**
             * @hidden
             */
            this.trackByDate = function (index, day) { return day.date.toISOString(); };
            this.locale = locale;
        }
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.ngOnInit = /**
         * @hidden
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.refresh) {
                    this.refreshSubscription = this.refresh.subscribe(function () {
                        _this.refreshAll();
                        _this.cdr.markForCheck();
                    });
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} changes
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.ngOnChanges = /**
         * @hidden
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes.viewDate || changes.excludeDays || changes.weekendDays) {
                    this.refreshHeader();
                }
                if (changes.events) {
                    validateEvents(this.events);
                }
                if (changes.viewDate ||
                    changes.events ||
                    changes.excludeDays ||
                    changes.weekendDays) {
                    this.refreshBody();
                }
                if (changes.activeDayIsOpen ||
                    changes.viewDate ||
                    changes.events ||
                    changes.excludeDays) {
                    this.checkActiveDayIsOpen();
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.ngOnDestroy = /**
         * @hidden
         * @return {?}
         */
            function () {
                if (this.refreshSubscription) {
                    this.refreshSubscription.unsubscribe();
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} event
         * @param {?} isHighlighted
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.toggleDayHighlight = /**
         * @hidden
         * @param {?} event
         * @param {?} isHighlighted
         * @return {?}
         */
            function (event, isHighlighted) {
                this.view.days.forEach(function (day) {
                    if (isHighlighted && day.events.indexOf(event) > -1) {
                        day.backgroundColor =
                            (event.color && event.color.secondary) || '#D1E8FF';
                    }
                    else {
                        delete day.backgroundColor;
                    }
                });
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} droppedOn
         * @param {?} event
         * @param {?=} draggedFrom
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.eventDropped = /**
         * @hidden
         * @param {?} droppedOn
         * @param {?} event
         * @param {?=} draggedFrom
         * @return {?}
         */
            function (droppedOn, event, draggedFrom) {
                if (droppedOn !== draggedFrom) {
                    /** @type {?} */
                    var year = this.dateAdapter.getYear(droppedOn.date);
                    /** @type {?} */
                    var month = this.dateAdapter.getMonth(droppedOn.date);
                    /** @type {?} */
                    var date = this.dateAdapter.getDate(droppedOn.date);
                    /** @type {?} */
                    var newStart = this.dateAdapter.setDate(this.dateAdapter.setMonth(this.dateAdapter.setYear(event.start, year), month), date);
                    /** @type {?} */
                    var newEnd = void 0;
                    if (event.end) {
                        /** @type {?} */
                        var secondsDiff = this.dateAdapter.differenceInSeconds(newStart, event.start);
                        newEnd = this.dateAdapter.addSeconds(event.end, secondsDiff);
                    }
                    this.eventTimesChanged.emit({
                        event: event,
                        newStart: newStart,
                        newEnd: newEnd,
                        day: droppedOn,
                        type: CalendarEventTimesChangedEventType.Drop
                    });
                }
            };
        /**
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.refreshHeader = /**
         * @return {?}
         */
            function () {
                this.columnHeaders = this.utils.getWeekViewHeader({
                    viewDate: this.viewDate,
                    weekStartsOn: this.weekStartsOn,
                    excluded: this.excludeDays,
                    weekendDays: this.weekendDays
                });
                this.emitBeforeViewRender();
            };
        /**
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.refreshBody = /**
         * @return {?}
         */
            function () {
                this.view = this.utils.getMonthView({
                    events: this.events,
                    viewDate: this.viewDate,
                    weekStartsOn: this.weekStartsOn,
                    excluded: this.excludeDays,
                    weekendDays: this.weekendDays
                });
                this.emitBeforeViewRender();
            };
        /**
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.checkActiveDayIsOpen = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.activeDayIsOpen === true) {
                    this.openDay = this.view.days.find(function (day) {
                        return _this.dateAdapter.isSameDay(day.date, _this.viewDate);
                    });
                    /** @type {?} */
                    var index = this.view.days.indexOf(this.openDay);
                    this.openRowIndex =
                        Math.floor(index / this.view.totalDaysVisibleInWeek) *
                            this.view.totalDaysVisibleInWeek;
                }
                else {
                    this.openRowIndex = null;
                    this.openDay = null;
                }
            };
        /**
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.refreshAll = /**
         * @return {?}
         */
            function () {
                this.columnHeaders = null;
                this.view = null;
                this.refreshHeader();
                this.refreshBody();
                this.checkActiveDayIsOpen();
            };
        /**
         * @return {?}
         */
        CalendarMonthViewComponent.prototype.emitBeforeViewRender = /**
         * @return {?}
         */
            function () {
                if (this.columnHeaders && this.view) {
                    this.beforeViewRender.emit({
                        header: this.columnHeaders,
                        body: this.view.days,
                        period: this.view.period
                    });
                }
            };
        CalendarMonthViewComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-month-view',
                        template: "\n    <div class=\"cal-month-view\">\n      <mwl-calendar-month-view-header\n        [days]=\"columnHeaders\"\n        [locale]=\"locale\"\n        [customTemplate]=\"headerTemplate\">\n      </mwl-calendar-month-view-header>\n      <div class=\"cal-days\">\n        <div *ngFor=\"let rowIndex of view.rowOffsets; trackByIndex\">\n          <div class=\"cal-cell-row\">\n            <mwl-calendar-month-cell\n              *ngFor=\"let day of (view.days | slice : rowIndex : rowIndex + (view.totalDaysVisibleInWeek)); trackBy:trackByDate\"\n              [ngClass]=\"day?.cssClass\"\n              [day]=\"day\"\n              [openDay]=\"openDay\"\n              [locale]=\"locale\"\n              [tooltipPlacement]=\"tooltipPlacement\"\n              [tooltipAppendToBody]=\"tooltipAppendToBody\"\n              [tooltipTemplate]=\"tooltipTemplate\"\n              [customTemplate]=\"cellTemplate\"\n              (mwlClick)=\"dayClicked.emit({ day: day })\"\n              (highlightDay)=\"toggleDayHighlight($event.event, true)\"\n              (unhighlightDay)=\"toggleDayHighlight($event.event, false)\"\n              mwlDroppable\n              dragOverClass=\"cal-drag-over\"\n              (drop)=\"eventDropped(day, $event.dropData.event, $event.dropData.draggedFrom)\"\n              (eventClicked)=\"eventClicked.emit({event: $event.event})\">\n            </mwl-calendar-month-cell>\n          </div>\n          <mwl-calendar-open-day-events\n            [isOpen]=\"openRowIndex === rowIndex\"\n            [events]=\"openDay?.events\"\n            [customTemplate]=\"openDayEventsTemplate\"\n            [eventTitleTemplate]=\"eventTitleTemplate\"\n            [eventActionsTemplate]=\"eventActionsTemplate\"\n            (eventClicked)=\"eventClicked.emit({event: $event.event})\"\n            mwlDroppable\n            dragOverClass=\"cal-drag-over\"\n            (drop)=\"eventDropped(openDay, $event.dropData.event, $event.dropData.draggedFrom)\">\n          </mwl-calendar-open-day-events>\n        </div>\n      </div>\n    </div>\n  "
                    }] }
        ];
        /** @nocollapse */
        CalendarMonthViewComponent.ctorParameters = function () {
            return [
                { type: core.ChangeDetectorRef },
                { type: CalendarUtils },
                { type: String, decorators: [{ type: core.Inject, args: [core.LOCALE_ID,] }] },
                { type: DateAdapter }
            ];
        };
        CalendarMonthViewComponent.propDecorators = {
            viewDate: [{ type: core.Input }],
            events: [{ type: core.Input }],
            excludeDays: [{ type: core.Input }],
            activeDayIsOpen: [{ type: core.Input }],
            refresh: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            tooltipPlacement: [{ type: core.Input }],
            tooltipTemplate: [{ type: core.Input }],
            tooltipAppendToBody: [{ type: core.Input }],
            weekStartsOn: [{ type: core.Input }],
            headerTemplate: [{ type: core.Input }],
            cellTemplate: [{ type: core.Input }],
            openDayEventsTemplate: [{ type: core.Input }],
            eventTitleTemplate: [{ type: core.Input }],
            eventActionsTemplate: [{ type: core.Input }],
            weekendDays: [{ type: core.Input }],
            beforeViewRender: [{ type: core.Output }],
            dayClicked: [{ type: core.Output }],
            eventClicked: [{ type: core.Output }],
            eventTimesChanged: [{ type: core.Output }]
        };
        return CalendarMonthViewComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarMonthViewHeaderComponent = /** @class */ (function () {
        function CalendarMonthViewHeaderComponent() {
            this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
        }
        CalendarMonthViewHeaderComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-month-view-header',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-days=\"days\"\n      let-locale=\"locale\">\n      <div class=\"cal-cell-row cal-header\">\n        <div\n          class=\"cal-cell\"\n          *ngFor=\"let day of days; trackBy:trackByWeekDayHeaderDate\"\n          [class.cal-past]=\"day.isPast\"\n          [class.cal-today]=\"day.isToday\"\n          [class.cal-future]=\"day.isFuture\"\n          [class.cal-weekend]=\"day.isWeekend\"\n          [ngClass]=\"day.cssClass\">\n          {{ day.date | calendarDate:'monthViewColumnHeader':locale }}\n        </div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{days: days, locale: locale}\">\n    </ng-template>\n  "
                    }] }
        ];
        CalendarMonthViewHeaderComponent.propDecorators = {
            days: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }]
        };
        return CalendarMonthViewHeaderComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarMonthCellComponent = /** @class */ (function () {
        function CalendarMonthCellComponent() {
            this.highlightDay = new core.EventEmitter();
            this.unhighlightDay = new core.EventEmitter();
            this.eventClicked = new core.EventEmitter();
            this.trackByEventId = trackByEventId;
        }
        CalendarMonthCellComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-month-cell',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-day=\"day\"\n      let-openDay=\"openDay\"\n      let-locale=\"locale\"\n      let-tooltipPlacement=\"tooltipPlacement\"\n      let-highlightDay=\"highlightDay\"\n      let-unhighlightDay=\"unhighlightDay\"\n      let-eventClicked=\"eventClicked\"\n      let-tooltipTemplate=\"tooltipTemplate\"\n      let-tooltipAppendToBody=\"tooltipAppendToBody\">\n      <div class=\"cal-cell-top\">\n        <span class=\"cal-day-badge\" *ngIf=\"day.badgeTotal > 0\">{{ day.badgeTotal }}</span>\n        <span class=\"cal-day-number\">{{ day.date | calendarDate:'monthViewDayNumber':locale }}</span>\n      </div>\n      <div class=\"cal-events\" *ngIf=\"day.events.length > 0\">\n        <div\n          class=\"cal-event\"\n          *ngFor=\"let event of day.events; trackBy:trackByEventId\"\n          [style.backgroundColor]=\"event.color?.primary\"\n          [ngClass]=\"event?.cssClass\"\n          (mouseenter)=\"highlightDay.emit({event: event})\"\n          (mouseleave)=\"unhighlightDay.emit({event: event})\"\n          [mwlCalendarTooltip]=\"event.title | calendarEventTitle:'monthTooltip':event\"\n          [tooltipPlacement]=\"tooltipPlacement\"\n          [tooltipEvent]=\"event\"\n          [tooltipTemplate]=\"tooltipTemplate\"\n          [tooltipAppendToBody]=\"tooltipAppendToBody\"\n          mwlDraggable\n          [class.cal-draggable]=\"event.draggable\"\n          dragActiveClass=\"cal-drag-active\"\n          [dropData]=\"{event: event, draggedFrom: day}\"\n          [dragAxis]=\"{x: event.draggable, y: event.draggable}\"\n          (mwlClick)=\"eventClicked.emit({ event: event })\">\n        </div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        day: day,\n        openDay: openDay,\n        locale: locale,\n        tooltipPlacement: tooltipPlacement,\n        highlightDay: highlightDay,\n        unhighlightDay: unhighlightDay,\n        eventClicked: eventClicked,\n        tooltipTemplate: tooltipTemplate,\n        tooltipAppendToBody: tooltipAppendToBody\n      }\">\n    </ng-template>\n  ",
                        host: {
                            class: 'cal-cell cal-day-cell',
                            '[class.cal-past]': 'day.isPast',
                            '[class.cal-today]': 'day.isToday',
                            '[class.cal-future]': 'day.isFuture',
                            '[class.cal-weekend]': 'day.isWeekend',
                            '[class.cal-in-month]': 'day.inMonth',
                            '[class.cal-out-month]': '!day.inMonth',
                            '[class.cal-has-events]': 'day.events.length > 0',
                            '[class.cal-open]': 'day === openDay',
                            '[class.cal-event-highlight]': '!!day.backgroundColor',
                            '[style.backgroundColor]': 'day.backgroundColor'
                        }
                    }] }
        ];
        CalendarMonthCellComponent.propDecorators = {
            day: [{ type: core.Input }],
            openDay: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            tooltipPlacement: [{ type: core.Input }],
            tooltipAppendToBody: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }],
            tooltipTemplate: [{ type: core.Input }],
            highlightDay: [{ type: core.Output }],
            unhighlightDay: [{ type: core.Output }],
            eventClicked: [{ type: core.Output }]
        };
        return CalendarMonthCellComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var collapseAnimation = animations.trigger('collapse', [
        animations.transition('void => *', [
            animations.style({ height: 0, overflow: 'hidden' }),
            animations.animate('150ms', animations.style({ height: '*' }))
        ]),
        animations.transition('* => void', [
            animations.style({ height: '*', overflow: 'hidden' }),
            animations.animate('150ms', animations.style({ height: 0 }))
        ])
    ]);
    var CalendarOpenDayEventsComponent = /** @class */ (function () {
        function CalendarOpenDayEventsComponent() {
            this.isOpen = false;
            this.eventClicked = new core.EventEmitter();
            this.trackByEventId = trackByEventId;
        }
        CalendarOpenDayEventsComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-open-day-events',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-events=\"events\"\n      let-eventClicked=\"eventClicked\"\n      let-isOpen=\"isOpen\">\n      <div class=\"cal-open-day-events\" [@collapse] *ngIf=\"isOpen\">\n        <div\n          *ngFor=\"let event of events; trackBy:trackByEventId\"\n          [ngClass]=\"event?.cssClass\"\n          mwlDraggable\n          [class.cal-draggable]=\"event.draggable\"\n          dragActiveClass=\"cal-drag-active\"\n          [dropData]=\"{event: event}\"\n          [dragAxis]=\"{x: event.draggable, y: event.draggable}\">\n          <span\n            class=\"cal-event\"\n            [style.backgroundColor]=\"event.color?.primary\">\n          </span>\n          &ngsp;\n          <mwl-calendar-event-title\n            [event]=\"event\"\n            [customTemplate]=\"eventTitleTemplate\"\n            view=\"month\"\n            (mwlClick)=\"eventClicked.emit({event: event})\">\n          </mwl-calendar-event-title>\n          &ngsp;\n          <mwl-calendar-event-actions\n            [event]=\"event\"\n            [customTemplate]=\"eventActionsTemplate\">\n          </mwl-calendar-event-actions>\n        </div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        events: events,\n        eventClicked: eventClicked,\n        isOpen: isOpen\n      }\">\n    </ng-template>\n  ",
                        animations: [collapseAnimation]
                    }] }
        ];
        CalendarOpenDayEventsComponent.propDecorators = {
            isOpen: [{ type: core.Input }],
            events: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }],
            eventTitleTemplate: [{ type: core.Input }],
            eventActionsTemplate: [{ type: core.Input }],
            eventClicked: [{ type: core.Output }]
        };
        return CalendarOpenDayEventsComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarMonthModule = /** @class */ (function () {
        function CalendarMonthModule() {
        }
        CalendarMonthModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, angularDraggableDroppable.DragAndDropModule, CalendarCommonModule],
                        declarations: [
                            CalendarMonthViewComponent,
                            CalendarMonthCellComponent,
                            CalendarOpenDayEventsComponent,
                            CalendarMonthViewHeaderComponent
                        ],
                        exports: [
                            angularDraggableDroppable.DragAndDropModule,
                            CalendarMonthViewComponent,
                            CalendarMonthCellComponent,
                            CalendarOpenDayEventsComponent,
                            CalendarMonthViewHeaderComponent
                        ]
                    },] }
        ];
        return CalendarMonthModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var DRAG_THRESHOLD = 1;
    var CalendarDragHelper = /** @class */ (function () {
        function CalendarDragHelper(dragContainerElement, draggableElement) {
            this.dragContainerElement = dragContainerElement;
            this.startPosition = draggableElement.getBoundingClientRect();
        }
        /**
         * @param {?} __0
         * @return {?}
         */
        CalendarDragHelper.prototype.validateDrag = /**
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var x = _a.x, y = _a.y, snapDraggedEvents = _a.snapDraggedEvents;
                /** @type {?} */
                var isWithinThreshold = Math.abs(x) > DRAG_THRESHOLD || Math.abs(y) > DRAG_THRESHOLD;
                if (snapDraggedEvents) {
                    /** @type {?} */
                    var newRect = Object.assign({}, this.startPosition, {
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
            };
        return CalendarDragHelper;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarResizeHelper = /** @class */ (function () {
        function CalendarResizeHelper(resizeContainerElement, minWidth) {
            this.resizeContainerElement = resizeContainerElement;
            this.minWidth = minWidth;
        }
        /**
         * @param {?} __0
         * @return {?}
         */
        CalendarResizeHelper.prototype.validateResize = /**
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var rectangle = _a.rectangle;
                if (this.minWidth &&
                    Math.ceil(rectangle.width) < Math.ceil(this.minWidth)) {
                    return false;
                }
                return isInside(this.resizeContainerElement.getBoundingClientRect(), rectangle);
            };
        return CalendarResizeHelper;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Shows all events on a given week. Example usage:
     *
     * ```typescript
     * <mwl-calendar-week-view
     *  [viewDate]="viewDate"
     *  [events]="events">
     * </mwl-calendar-week-view>
     * ```
     */
    var CalendarWeekViewComponent = /** @class */ (function () {
        /**
         * @hidden
         */
        function CalendarWeekViewComponent(cdr, utils, locale, dateAdapter) {
            this.cdr = cdr;
            this.utils = utils;
            this.dateAdapter = dateAdapter;
            /**
             * An array of events to display on view
             * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
             */
            this.events = [];
            /**
             * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
             */
            this.excludeDays = [];
            /**
             * The placement of the event tooltip
             */
            this.tooltipPlacement = 'auto';
            /**
             * Whether to append tooltips to the body or next to the trigger element
             */
            this.tooltipAppendToBody = true;
            /**
             * The precision to display events.
             * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
             */
            this.precision = 'days';
            /**
             * Whether to snap events to a grid when dragging
             */
            this.snapDraggedEvents = true;
            /**
             * The number of segments in an hour. Must be <= 6
             */
            this.hourSegments = 2;
            /**
             * The height in pixels of each hour segment
             */
            this.hourSegmentHeight = 30;
            /**
             * The day start hours in 24 hour time. Must be 0-23
             */
            this.dayStartHour = 0;
            /**
             * The day start minutes. Must be 0-59
             */
            this.dayStartMinute = 0;
            /**
             * The day end hours in 24 hour time. Must be 0-23
             */
            this.dayEndHour = 23;
            /**
             * The day end minutes. Must be 0-59
             */
            this.dayEndMinute = 59;
            /**
             * Called when a header week day is clicked. Adding a `cssClass` property on `$event.day` will add that class to the header element
             */
            this.dayHeaderClicked = new core.EventEmitter();
            /**
             * Called when the event title is clicked
             */
            this.eventClicked = new core.EventEmitter();
            /**
             * Called when an event is resized or dragged and dropped
             */
            this.eventTimesChanged = new core.EventEmitter();
            /**
             * An output that will be called before the view is rendered for the current week.
             * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
             */
            this.beforeViewRender = new core.EventEmitter();
            /**
             * Called when an hour segment is clicked
             */
            this.hourSegmentClicked = new core.EventEmitter();
            /**
             * @hidden
             */
            this.allDayEventResizes = new Map();
            /**
             * @hidden
             */
            this.timeEventResizes = new Map();
            /**
             * @hidden
             */
            this.eventDragEnter = 0;
            /**
             * @hidden
             */
            this.dragActive = false;
            /**
             * @hidden
             */
            this.calendarId = Symbol('angular calendar week view id');
            /**
             * @hidden
             */
            this.trackByIndex = trackByIndex;
            /**
             * @hidden
             */
            this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
            /**
             * @hidden
             */
            this.trackByHourSegment = trackByHourSegment;
            /**
             * @hidden
             */
            this.trackByHour = trackByHour;
            /**
             * @hidden
             */
            this.trackByDayOrWeekEvent = trackByDayOrWeekEvent;
            /**
             * @hidden
             */
            this.trackByHourColumn = function (index, column) {
                return column.hours[0] ? column.hours[0].segments[0].date.toISOString() : column;
            };
            this.locale = locale;
        }
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.ngOnInit = /**
         * @hidden
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.refresh) {
                    this.refreshSubscription = this.refresh.subscribe(function () {
                        _this.refreshAll();
                        _this.cdr.markForCheck();
                    });
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} changes
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.ngOnChanges = /**
         * @hidden
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes.viewDate ||
                    changes.excludeDays ||
                    changes.weekendDays ||
                    changes.daysInWeek) {
                    this.refreshHeader();
                }
                if (changes.events) {
                    validateEvents(this.events);
                }
                if (changes.viewDate ||
                    changes.dayStartHour ||
                    changes.dayStartMinute ||
                    changes.dayEndHour ||
                    changes.dayEndMinute ||
                    changes.hourSegments ||
                    changes.weekStartsOn ||
                    changes.weekendDays ||
                    changes.excludeDays ||
                    changes.hourSegmentHeight ||
                    changes.events ||
                    changes.daysInWeek) {
                    this.refreshBody();
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.ngOnDestroy = /**
         * @hidden
         * @return {?}
         */
            function () {
                if (this.refreshSubscription) {
                    this.refreshSubscription.unsubscribe();
                }
            };
        /**
         * @param {?} eventsContainer
         * @param {?=} minWidth
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.resizeStarted = /**
         * @param {?} eventsContainer
         * @param {?=} minWidth
         * @return {?}
         */
            function (eventsContainer, minWidth) {
                this.dayColumnWidth = this.getDayColumnWidth(eventsContainer);
                /** @type {?} */
                var resizeHelper = new CalendarResizeHelper(eventsContainer, minWidth);
                this.validateResize = function (_a) {
                    var rectangle = _a.rectangle;
                    return resizeHelper.validateResize({ rectangle: rectangle });
                };
                this.cdr.markForCheck();
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} eventsContainer
         * @param {?} timeEvent
         * @param {?} resizeEvent
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.timeEventResizeStarted = /**
         * @hidden
         * @param {?} eventsContainer
         * @param {?} timeEvent
         * @param {?} resizeEvent
         * @return {?}
         */
            function (eventsContainer, timeEvent, resizeEvent) {
                this.timeEventResizes.set(timeEvent.event, resizeEvent);
                this.resizeStarted(eventsContainer);
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} timeEvent
         * @param {?} resizeEvent
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.timeEventResizing = /**
         * @hidden
         * @param {?} timeEvent
         * @param {?} resizeEvent
         * @return {?}
         */
            function (timeEvent, resizeEvent) {
                var _this = this;
                this.timeEventResizes.set(timeEvent.event, resizeEvent);
                /** @type {?} */
                var adjustedEvents = new Map();
                /** @type {?} */
                var tempEvents = __spread(this.events);
                this.timeEventResizes.forEach(function (lastResizeEvent, event) {
                    /** @type {?} */
                    var newEventDates = _this.getTimeEventResizedDates(event, lastResizeEvent);
                    /** @type {?} */
                    var adjustedEvent = __assign({}, event, newEventDates);
                    adjustedEvents.set(adjustedEvent, event);
                    /** @type {?} */
                    var eventIndex = tempEvents.indexOf(event);
                    tempEvents[eventIndex] = adjustedEvent;
                });
                this.restoreOriginalEvents(tempEvents, adjustedEvents);
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} timeEvent
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.timeEventResizeEnded = /**
         * @hidden
         * @param {?} timeEvent
         * @return {?}
         */
            function (timeEvent) {
                this.view = this.getWeekView(this.events);
                /** @type {?} */
                var lastResizeEvent = this.timeEventResizes.get(timeEvent.event);
                this.timeEventResizes.delete(timeEvent.event);
                /** @type {?} */
                var newEventDates = this.getTimeEventResizedDates(timeEvent.event, lastResizeEvent);
                this.eventTimesChanged.emit({
                    newStart: newEventDates.start,
                    newEnd: newEventDates.end,
                    event: timeEvent.event,
                    type: CalendarEventTimesChangedEventType.Resize
                });
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} allDayEventsContainer
         * @param {?} allDayEvent
         * @param {?} resizeEvent
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.allDayEventResizeStarted = /**
         * @hidden
         * @param {?} allDayEventsContainer
         * @param {?} allDayEvent
         * @param {?} resizeEvent
         * @return {?}
         */
            function (allDayEventsContainer, allDayEvent, resizeEvent) {
                this.allDayEventResizes.set(allDayEvent, {
                    originalOffset: allDayEvent.offset,
                    originalSpan: allDayEvent.span,
                    edge: typeof resizeEvent.edges.left !== 'undefined' ? 'left' : 'right'
                });
                this.resizeStarted(allDayEventsContainer, this.getDayColumnWidth(allDayEventsContainer));
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} allDayEvent
         * @param {?} resizeEvent
         * @param {?} dayWidth
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.allDayEventResizing = /**
         * @hidden
         * @param {?} allDayEvent
         * @param {?} resizeEvent
         * @param {?} dayWidth
         * @return {?}
         */
            function (allDayEvent, resizeEvent, dayWidth) {
                /** @type {?} */
                var currentResize = this.allDayEventResizes.get(allDayEvent);
                if (resizeEvent.edges.left) {
                    /** @type {?} */
                    var diff = Math.round(+resizeEvent.edges.left / dayWidth);
                    allDayEvent.offset = currentResize.originalOffset + diff;
                    allDayEvent.span = currentResize.originalSpan - diff;
                }
                else if (resizeEvent.edges.right) {
                    /** @type {?} */
                    var diff = Math.round(+resizeEvent.edges.right / dayWidth);
                    allDayEvent.span = currentResize.originalSpan + diff;
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} allDayEvent
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.allDayEventResizeEnded = /**
         * @hidden
         * @param {?} allDayEvent
         * @return {?}
         */
            function (allDayEvent) {
                /** @type {?} */
                var currentResize = this.allDayEventResizes.get(allDayEvent);
                /** @type {?} */
                var allDayEventResizingBeforeStart = currentResize.edge === 'left';
                /** @type {?} */
                var daysDiff;
                if (allDayEventResizingBeforeStart) {
                    daysDiff = allDayEvent.offset - currentResize.originalOffset;
                }
                else {
                    daysDiff = allDayEvent.span - currentResize.originalSpan;
                }
                allDayEvent.offset = currentResize.originalOffset;
                allDayEvent.span = currentResize.originalSpan;
                /** @type {?} */
                var newStart = allDayEvent.event.start;
                /** @type {?} */
                var newEnd = allDayEvent.event.end || allDayEvent.event.start;
                if (allDayEventResizingBeforeStart) {
                    newStart = this.dateAdapter.addDays(newStart, daysDiff);
                }
                else {
                    newEnd = this.dateAdapter.addDays(newEnd, daysDiff);
                }
                this.eventTimesChanged.emit({
                    newStart: newStart,
                    newEnd: newEnd,
                    event: allDayEvent.event,
                    type: CalendarEventTimesChangedEventType.Resize
                });
                this.allDayEventResizes.delete(allDayEvent);
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} eventRowContainer
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.getDayColumnWidth = /**
         * @hidden
         * @param {?} eventRowContainer
         * @return {?}
         */
            function (eventRowContainer) {
                return Math.floor(eventRowContainer.offsetWidth / this.days.length);
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} dropEvent
         * @param {?} date
         * @param {?} allDay
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.eventDropped = /**
         * @hidden
         * @param {?} dropEvent
         * @param {?} date
         * @param {?} allDay
         * @return {?}
         */
            function (dropEvent, date, allDay) {
                if (shouldFireDroppedEvent(dropEvent, date, allDay, this.calendarId)) {
                    this.eventTimesChanged.emit({
                        type: CalendarEventTimesChangedEventType.Drop,
                        event: dropEvent.dropData.event,
                        newStart: date,
                        allDay: allDay
                    });
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} eventsContainer
         * @param {?} event
         * @param {?=} dayEvent
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.dragStarted = /**
         * @hidden
         * @param {?} eventsContainer
         * @param {?} event
         * @param {?=} dayEvent
         * @return {?}
         */
            function (eventsContainer, event, dayEvent) {
                var _this = this;
                this.dayColumnWidth = this.getDayColumnWidth(eventsContainer);
                /** @type {?} */
                var dragHelper = new CalendarDragHelper(eventsContainer, event);
                this.validateDrag = function (_a) {
                    var x = _a.x, y = _a.y;
                    return _this.allDayEventResizes.size === 0 &&
                        _this.timeEventResizes.size === 0 &&
                        dragHelper.validateDrag({
                            x: x,
                            y: y,
                            snapDraggedEvents: _this.snapDraggedEvents
                        });
                };
                this.dragActive = true;
                this.eventDragEnter = 0;
                if (!this.snapDraggedEvents && dayEvent) {
                    this.view.hourColumns.forEach(function (column) {
                        /** @type {?} */
                        var linkedEvent = column.events.find(function (columnEvent) {
                            return columnEvent.event === dayEvent.event && columnEvent !== dayEvent;
                        });
                        // hide any linked events while dragging
                        if (linkedEvent) {
                            linkedEvent.width = 0;
                            linkedEvent.height = 0;
                        }
                    });
                }
                this.cdr.markForCheck();
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} dayEvent
         * @param {?} dragEvent
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.dragMove = /**
         * @hidden
         * @param {?} dayEvent
         * @param {?} dragEvent
         * @return {?}
         */
            function (dayEvent, dragEvent) {
                if (this.snapDraggedEvents) {
                    /** @type {?} */
                    var newEventTimes = this.getDragMovedEventTimes(dayEvent, dragEvent, this.dayColumnWidth, true);
                    /** @type {?} */
                    var originalEvent_1 = dayEvent.event;
                    /** @type {?} */
                    var adjustedEvent_1 = __assign({}, originalEvent_1, newEventTimes);
                    /** @type {?} */
                    var tempEvents = this.events.map(function (event) {
                        if (event === originalEvent_1) {
                            return adjustedEvent_1;
                        }
                        return event;
                    });
                    this.restoreOriginalEvents(tempEvents, new Map([[adjustedEvent_1, originalEvent_1]]));
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} weekEvent
         * @param {?} dragEndEvent
         * @param {?} dayWidth
         * @param {?=} useY
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.dragEnded = /**
         * @hidden
         * @param {?} weekEvent
         * @param {?} dragEndEvent
         * @param {?} dayWidth
         * @param {?=} useY
         * @return {?}
         */
            function (weekEvent, dragEndEvent, dayWidth, useY) {
                if (useY === void 0) {
                    useY = false;
                }
                this.view = this.getWeekView(this.events);
                this.dragActive = false;
                var _a = this.getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY), start = _a.start, end = _a.end;
                if (this.eventDragEnter > 0 &&
                    isDraggedWithinPeriod(start, end, this.view.period)) {
                    this.eventTimesChanged.emit({
                        newStart: start,
                        newEnd: end,
                        event: weekEvent.event,
                        type: CalendarEventTimesChangedEventType.Drag,
                        allDay: !useY
                    });
                }
            };
        /**
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.refreshHeader = /**
         * @return {?}
         */
            function () {
                this.days = this.utils.getWeekViewHeader(__assign({ viewDate: this.viewDate, weekStartsOn: this.weekStartsOn, excluded: this.excludeDays, weekendDays: this.weekendDays }, getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)));
                this.emitBeforeViewRender();
            };
        /**
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.refreshBody = /**
         * @return {?}
         */
            function () {
                this.view = this.getWeekView(this.events);
                this.emitBeforeViewRender();
            };
        /**
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.refreshAll = /**
         * @return {?}
         */
            function () {
                this.refreshHeader();
                this.refreshBody();
            };
        /**
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.emitBeforeViewRender = /**
         * @return {?}
         */
            function () {
                if (this.days && this.view) {
                    this.beforeViewRender.emit(__assign({ header: this.days }, this.view));
                }
            };
        /**
         * @param {?} events
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.getWeekView = /**
         * @param {?} events
         * @return {?}
         */
            function (events) {
                return this.utils.getWeekView(__assign({ events: events, viewDate: this.viewDate, weekStartsOn: this.weekStartsOn, excluded: this.excludeDays, precision: this.precision, absolutePositionedEvents: true, hourSegments: this.hourSegments, dayStart: {
                        hour: this.dayStartHour,
                        minute: this.dayStartMinute
                    }, dayEnd: {
                        hour: this.dayEndHour,
                        minute: this.dayEndMinute
                    }, segmentHeight: this.hourSegmentHeight, weekendDays: this.weekendDays }, getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)));
            };
        /**
         * @param {?} weekEvent
         * @param {?} dragEndEvent
         * @param {?} dayWidth
         * @param {?} useY
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.getDragMovedEventTimes = /**
         * @param {?} weekEvent
         * @param {?} dragEndEvent
         * @param {?} dayWidth
         * @param {?} useY
         * @return {?}
         */
            function (weekEvent, dragEndEvent, dayWidth, useY) {
                /** @type {?} */
                var daysDragged = roundToNearest(dragEndEvent.x, dayWidth) / dayWidth;
                /** @type {?} */
                var minutesMoved = useY
                    ? getMinutesMoved(dragEndEvent.y, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize)
                    : 0;
                /** @type {?} */
                var start = this.dateAdapter.addMinutes(this.dateAdapter.addDays(weekEvent.event.start, daysDragged), minutesMoved);
                /** @type {?} */
                var end;
                if (weekEvent.event.end) {
                    end = this.dateAdapter.addMinutes(this.dateAdapter.addDays(weekEvent.event.end, daysDragged), minutesMoved);
                }
                return { start: start, end: end };
            };
        /**
         * @param {?} tempEvents
         * @param {?} adjustedEvents
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.restoreOriginalEvents = /**
         * @param {?} tempEvents
         * @param {?} adjustedEvents
         * @return {?}
         */
            function (tempEvents, adjustedEvents) {
                this.view = this.getWeekView(tempEvents);
                /** @type {?} */
                var adjustedEventsArray = tempEvents.filter(function (event) {
                    return adjustedEvents.has(event);
                });
                this.view.hourColumns.forEach(function (column) {
                    adjustedEventsArray.forEach(function (adjustedEvent) {
                        /** @type {?} */
                        var originalEvent = adjustedEvents.get(adjustedEvent);
                        /** @type {?} */
                        var existingColumnEvent = column.events.find(function (columnEvent) { return columnEvent.event === adjustedEvent; });
                        if (existingColumnEvent) {
                            // restore the original event so trackBy kicks in and the dom isn't changed
                            existingColumnEvent.event = originalEvent;
                        }
                        else {
                            // add a dummy event to the drop so if the event was removed from the original column the drag doesn't end early
                            column.events.push({
                                event: originalEvent,
                                left: 0,
                                top: 0,
                                height: 0,
                                width: 0,
                                startsBeforeDay: false,
                                endsAfterDay: false
                            });
                        }
                    });
                });
                adjustedEvents.clear();
            };
        /**
         * @param {?} calendarEvent
         * @param {?} resizeEvent
         * @return {?}
         */
        CalendarWeekViewComponent.prototype.getTimeEventResizedDates = /**
         * @param {?} calendarEvent
         * @param {?} resizeEvent
         * @return {?}
         */
            function (calendarEvent, resizeEvent) {
                /** @type {?} */
                var minimumEventHeight = getMinimumEventHeightInMinutes(this.hourSegments, this.hourSegmentHeight);
                /** @type {?} */
                var newEventDates = {
                    start: calendarEvent.start,
                    end: getDefaultEventEnd(this.dateAdapter, calendarEvent, minimumEventHeight)
                };
                var end = calendarEvent.end, eventWithoutEnd = __rest(calendarEvent, ["end"]);
                /** @type {?} */
                var smallestResizes = {
                    start: this.dateAdapter.addMinutes(newEventDates.end, minimumEventHeight * -1),
                    end: getDefaultEventEnd(this.dateAdapter, eventWithoutEnd, minimumEventHeight)
                };
                if (resizeEvent.edges.left) {
                    /** @type {?} */
                    var daysDiff = Math.round(+resizeEvent.edges.left / this.dayColumnWidth);
                    /** @type {?} */
                    var newStart = this.dateAdapter.addDays(newEventDates.start, daysDiff);
                    if (newStart < smallestResizes.start) {
                        newEventDates.start = newStart;
                    }
                    else {
                        newEventDates.start = smallestResizes.start;
                    }
                }
                else if (resizeEvent.edges.right) {
                    /** @type {?} */
                    var daysDiff = Math.round(+resizeEvent.edges.right / this.dayColumnWidth);
                    /** @type {?} */
                    var newEnd = this.dateAdapter.addDays(newEventDates.end, daysDiff);
                    if (newEnd > smallestResizes.end) {
                        newEventDates.end = newEnd;
                    }
                    else {
                        newEventDates.end = smallestResizes.end;
                    }
                }
                if (resizeEvent.edges.top) {
                    /** @type {?} */
                    var minutesMoved = getMinutesMoved(/** @type {?} */ (resizeEvent.edges.top), this.hourSegments, this.hourSegmentHeight, this.eventSnapSize);
                    /** @type {?} */
                    var newStart = this.dateAdapter.addMinutes(newEventDates.start, minutesMoved);
                    if (newStart < smallestResizes.start) {
                        newEventDates.start = newStart;
                    }
                    else {
                        newEventDates.start = smallestResizes.start;
                    }
                }
                else if (resizeEvent.edges.bottom) {
                    /** @type {?} */
                    var minutesMoved = getMinutesMoved(/** @type {?} */ (resizeEvent.edges.bottom), this.hourSegments, this.hourSegmentHeight, this.eventSnapSize);
                    /** @type {?} */
                    var newEnd = this.dateAdapter.addMinutes(newEventDates.end, minutesMoved);
                    if (newEnd > smallestResizes.end) {
                        newEventDates.end = newEnd;
                    }
                    else {
                        newEventDates.end = smallestResizes.end;
                    }
                }
                return newEventDates;
            };
        CalendarWeekViewComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-week-view',
                        template: "\n    <div class=\"cal-week-view\">\n      <mwl-calendar-week-view-header\n        [days]=\"days\"\n        [locale]=\"locale\"\n        [customTemplate]=\"headerTemplate\"\n        (dayHeaderClicked)=\"dayHeaderClicked.emit($event)\"\n        (eventDropped)=\"eventDropped({dropData: $event}, $event.newStart, true)\">\n      </mwl-calendar-week-view-header>\n      <div\n        class=\"cal-all-day-events\"\n        #allDayEventsContainer\n        *ngIf=\"view.allDayEventRows.length > 0\"\n        mwlDroppable\n        (dragEnter)=\"eventDragEnter = eventDragEnter + 1\"\n        (dragLeave)=\"eventDragEnter = eventDragEnter - 1\">\n        <div class=\"cal-day-columns\">\n          <div\n            class=\"cal-time-label-column\"\n            [ngTemplateOutlet]=\"allDayEventsLabelTemplate\">\n          </div>\n          <div\n            class=\"cal-day-column\"\n            *ngFor=\"let day of days; trackBy:trackByWeekDayHeaderDate\"\n            mwlDroppable\n            dragOverClass=\"cal-drag-over\"\n            (drop)=\"eventDropped($event, day.date, true)\">\n          </div>\n        </div>\n        <div\n          *ngFor=\"let eventRow of view.allDayEventRows; trackBy:trackByIndex\"\n          #eventRowContainer\n          class=\"cal-events-row\">\n          <div\n            *ngFor=\"let allDayEvent of eventRow.row; trackBy:trackByDayOrWeekEvent\"\n            #event\n            class=\"cal-event-container\"\n            [class.cal-draggable]=\"allDayEvent.event.draggable && allDayEventResizes.size === 0\"\n            [class.cal-starts-within-week]=\"!allDayEvent.startsBeforeWeek\"\n            [class.cal-ends-within-week]=\"!allDayEvent.endsAfterWeek\"\n            [ngClass]=\"allDayEvent.event?.cssClass\"\n            [style.width.%]=\"(100 / days.length) * allDayEvent.span\"\n            [style.marginLeft.%]=\"(100 / days.length) * allDayEvent.offset\"\n            mwlResizable\n            [resizeSnapGrid]=\"{left: dayColumnWidth, right: dayColumnWidth}\"\n            [validateResize]=\"validateResize\"\n            (resizeStart)=\"allDayEventResizeStarted(eventRowContainer, allDayEvent, $event)\"\n            (resizing)=\"allDayEventResizing(allDayEvent, $event, dayColumnWidth)\"\n            (resizeEnd)=\"allDayEventResizeEnded(allDayEvent)\"\n            mwlDraggable\n            dragActiveClass=\"cal-drag-active\"\n            [dropData]=\"{event: allDayEvent.event, calendarId: calendarId}\"\n            [dragAxis]=\"{\n              x: allDayEvent.event.draggable && allDayEventResizes.size === 0,\n              y: !snapDraggedEvents && allDayEvent.event.draggable && allDayEventResizes.size === 0\n            }\"\n            [dragSnapGrid]=\"snapDraggedEvents ? {x: dayColumnWidth} : {}\"\n            [validateDrag]=\"validateDrag\"\n            (dragPointerDown)=\"dragStarted(eventRowContainer, event)\"\n            (dragEnd)=\"dragEnded(allDayEvent, $event, dayColumnWidth)\">\n            <div\n              class=\"cal-resize-handle cal-resize-handle-before-start\"\n              *ngIf=\"allDayEvent.event?.resizable?.beforeStart && !allDayEvent.startsBeforeWeek\"\n              mwlResizeHandle\n              [resizeEdges]=\"{ left: true }\">\n            </div>\n            <mwl-calendar-week-view-event\n              [weekEvent]=\"allDayEvent\"\n              [tooltipPlacement]=\"tooltipPlacement\"\n              [tooltipTemplate]=\"tooltipTemplate\"\n              [tooltipAppendToBody]=\"tooltipAppendToBody\"\n              [customTemplate]=\"eventTemplate\"\n              [eventTitleTemplate]=\"eventTitleTemplate\"\n              [eventActionsTemplate]=\"eventActionsTemplate\"\n              (eventClicked)=\"eventClicked.emit({event: allDayEvent.event})\">\n            </mwl-calendar-week-view-event>\n            <div\n              class=\"cal-resize-handle cal-resize-handle-after-end\"\n              *ngIf=\"allDayEvent.event?.resizable?.afterEnd && !allDayEvent.endsAfterWeek\"\n              mwlResizeHandle\n              [resizeEdges]=\"{ right: true }\">\n            </div>\n          </div>\n        </div>\n      </div>\n      <div\n        class=\"cal-time-events\"\n        mwlDroppable\n        (dragEnter)=\"eventDragEnter = eventDragEnter + 1\"\n        (dragLeave)=\"eventDragEnter = eventDragEnter - 1\">\n        <div class=\"cal-time-label-column\" *ngIf=\"view.hourColumns.length > 0\">\n          <div\n            *ngFor=\"let hour of view.hourColumns[0].hours; trackBy:trackByHour; let odd = odd\"\n            class=\"cal-hour\"\n            [class.cal-hour-odd]=\"odd\">\n            <mwl-calendar-week-view-hour-segment\n              *ngFor=\"let segment of hour.segments; trackBy:trackByHourSegment\"\n              [style.height.px]=\"hourSegmentHeight\"\n              [segment]=\"segment\"\n              [segmentHeight]=\"hourSegmentHeight\"\n              [locale]=\"locale\"\n              [customTemplate]=\"hourSegmentTemplate\"\n              [isTimeLabel]=\"true\">\n            </mwl-calendar-week-view-hour-segment>\n          </div>\n        </div>\n        <div\n          class=\"cal-day-columns\"\n          [class.cal-resize-active]=\"timeEventResizes.size > 0\"\n          #dayColumns>\n          <div\n            class=\"cal-day-column\"\n            *ngFor=\"let column of view.hourColumns; trackBy:trackByHourColumn\">\n            <div\n              *ngFor=\"let timeEvent of column.events; trackBy:trackByDayOrWeekEvent\"\n              #event\n              class=\"cal-event-container\"\n              [class.cal-draggable]=\"timeEvent.event.draggable && timeEventResizes.size === 0\"\n              [class.cal-starts-within-day]=\"!timeEvent.startsBeforeDay\"\n              [class.cal-ends-within-day]=\"!timeEvent.endsAfterDay\"\n              [ngClass]=\"timeEvent.event.cssClass\"\n              [hidden]=\"timeEvent.height === 0 && timeEvent.width === 0\"\n              [style.top.px]=\"timeEvent.top\"\n              [style.height.px]=\"timeEvent.height\"\n              [style.left.%]=\"timeEvent.left\"\n              [style.width.%]=\"timeEvent.width\"\n              mwlResizable\n              [resizeSnapGrid]=\"{left: dayColumnWidth, right: dayColumnWidth, top: eventSnapSize || hourSegmentHeight, bottom: eventSnapSize || hourSegmentHeight}\"\n              [validateResize]=\"validateResize\"\n              [allowNegativeResizes]=\"true\"\n              (resizeStart)=\"timeEventResizeStarted(dayColumns, timeEvent, $event)\"\n              (resizing)=\"timeEventResizing(timeEvent, $event)\"\n              (resizeEnd)=\"timeEventResizeEnded(timeEvent)\"\n              mwlDraggable\n              dragActiveClass=\"cal-drag-active\"\n              [dropData]=\"{event: timeEvent.event, calendarId: calendarId}\"\n              [dragAxis]=\"{\n                x: timeEvent.event.draggable && timeEventResizes.size === 0,\n                y: timeEvent.event.draggable && timeEventResizes.size === 0\n              }\"\n              [dragSnapGrid]=\"snapDraggedEvents ? {x: dayColumnWidth, y: eventSnapSize || hourSegmentHeight} : {}\"\n              [ghostDragEnabled]=\"!snapDraggedEvents\"\n              [validateDrag]=\"validateDrag\"\n              (dragPointerDown)=\"dragStarted(dayColumns, event, timeEvent)\"\n              (dragging)=\"dragMove(timeEvent, $event)\"\n              (dragEnd)=\"dragEnded(timeEvent, $event, dayColumnWidth, true)\">\n              <div\n                class=\"cal-resize-handle cal-resize-handle-before-start\"\n                *ngIf=\"timeEvent.event?.resizable?.beforeStart && !timeEvent.startsBeforeDay\"\n                mwlResizeHandle\n                [resizeEdges]=\"{\n                  left: true,\n                  top: true\n                }\">\n              </div>\n              <mwl-calendar-week-view-event\n                [weekEvent]=\"timeEvent\"\n                [tooltipPlacement]=\"tooltipPlacement\"\n                [tooltipTemplate]=\"tooltipTemplate\"\n                [tooltipAppendToBody]=\"tooltipAppendToBody\"\n                [tooltipDisabled]=\"dragActive || timeEventResizes.size > 0\"\n                [customTemplate]=\"eventTemplate\"\n                [eventTitleTemplate]=\"eventTitleTemplate\"\n                [eventActionsTemplate]=\"eventActionsTemplate\"\n                (eventClicked)=\"eventClicked.emit({event: timeEvent.event})\">\n              </mwl-calendar-week-view-event>\n              <div\n                class=\"cal-resize-handle cal-resize-handle-after-end\"\n                *ngIf=\"timeEvent.event?.resizable?.afterEnd && !timeEvent.endsAfterDay\"\n                mwlResizeHandle\n                [resizeEdges]=\"{\n                  right: true,\n                  bottom: true\n                }\">\n              </div>\n            </div>\n\n            <div\n              *ngFor=\"let hour of column.hours; trackBy:trackByHour; let odd = odd\"\n              class=\"cal-hour\"\n              [class.cal-hour-odd]=\"odd\">\n              <mwl-calendar-week-view-hour-segment\n                *ngFor=\"let segment of hour.segments; trackBy:trackByHourSegment\"\n                [style.height.px]=\"hourSegmentHeight\"\n                [segment]=\"segment\"\n                [segmentHeight]=\"hourSegmentHeight\"\n                [locale]=\"locale\"\n                [customTemplate]=\"hourSegmentTemplate\"\n                (mwlClick)=\"hourSegmentClicked.emit({date: segment.date})\"\n                mwlDroppable\n                [dragOverClass]=\"!dragActive || !snapDraggedEvents ? 'cal-drag-over' : null\"\n                dragActiveClass=\"cal-drag-active\"\n                (drop)=\"eventDropped($event, segment.date, false)\">\n              </mwl-calendar-week-view-hour-segment>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  "
                    }] }
        ];
        /** @nocollapse */
        CalendarWeekViewComponent.ctorParameters = function () {
            return [
                { type: core.ChangeDetectorRef },
                { type: CalendarUtils },
                { type: String, decorators: [{ type: core.Inject, args: [core.LOCALE_ID,] }] },
                { type: DateAdapter }
            ];
        };
        CalendarWeekViewComponent.propDecorators = {
            viewDate: [{ type: core.Input }],
            events: [{ type: core.Input }],
            excludeDays: [{ type: core.Input }],
            refresh: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            tooltipPlacement: [{ type: core.Input }],
            tooltipTemplate: [{ type: core.Input }],
            tooltipAppendToBody: [{ type: core.Input }],
            weekStartsOn: [{ type: core.Input }],
            headerTemplate: [{ type: core.Input }],
            eventTemplate: [{ type: core.Input }],
            eventTitleTemplate: [{ type: core.Input }],
            eventActionsTemplate: [{ type: core.Input }],
            precision: [{ type: core.Input }],
            weekendDays: [{ type: core.Input }],
            snapDraggedEvents: [{ type: core.Input }],
            hourSegments: [{ type: core.Input }],
            hourSegmentHeight: [{ type: core.Input }],
            dayStartHour: [{ type: core.Input }],
            dayStartMinute: [{ type: core.Input }],
            dayEndHour: [{ type: core.Input }],
            dayEndMinute: [{ type: core.Input }],
            hourSegmentTemplate: [{ type: core.Input }],
            eventSnapSize: [{ type: core.Input }],
            allDayEventsLabelTemplate: [{ type: core.Input }],
            daysInWeek: [{ type: core.Input }],
            dayHeaderClicked: [{ type: core.Output }],
            eventClicked: [{ type: core.Output }],
            eventTimesChanged: [{ type: core.Output }],
            beforeViewRender: [{ type: core.Output }],
            hourSegmentClicked: [{ type: core.Output }]
        };
        return CalendarWeekViewComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarWeekViewHeaderComponent = /** @class */ (function () {
        function CalendarWeekViewHeaderComponent() {
            this.dayHeaderClicked = new core.EventEmitter();
            this.eventDropped = new core.EventEmitter();
            this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
        }
        CalendarWeekViewHeaderComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-week-view-header',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-days=\"days\"\n      let-locale=\"locale\"\n      let-dayHeaderClicked=\"dayHeaderClicked\"\n      let-eventDropped=\"eventDropped\">\n      <div class=\"cal-day-headers\">\n        <div\n          class=\"cal-header\"\n          *ngFor=\"let day of days; trackBy:trackByWeekDayHeaderDate\"\n          [class.cal-past]=\"day.isPast\"\n          [class.cal-today]=\"day.isToday\"\n          [class.cal-future]=\"day.isFuture\"\n          [class.cal-weekend]=\"day.isWeekend\"\n          [ngClass]=\"day.cssClass\"\n          (mwlClick)=\"dayHeaderClicked.emit({day: day})\"\n          mwlDroppable\n          dragOverClass=\"cal-drag-over\"\n          (drop)=\"eventDropped.emit({event: $event.dropData.event, newStart: day.date})\">\n          <b>{{ day.date | calendarDate:'weekViewColumnHeader':locale }}</b><br>\n          <span>{{ day.date | calendarDate:'weekViewColumnSubHeader':locale }}</span>\n        </div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{days: days, locale: locale, dayHeaderClicked: dayHeaderClicked, eventDropped: eventDropped}\">\n    </ng-template>\n  "
                    }] }
        ];
        CalendarWeekViewHeaderComponent.propDecorators = {
            days: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }],
            dayHeaderClicked: [{ type: core.Output }],
            eventDropped: [{ type: core.Output }]
        };
        return CalendarWeekViewHeaderComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarWeekViewEventComponent = /** @class */ (function () {
        function CalendarWeekViewEventComponent() {
            this.eventClicked = new core.EventEmitter();
        }
        CalendarWeekViewEventComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-week-view-event',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-weekEvent=\"weekEvent\"\n      let-tooltipPlacement=\"tooltipPlacement\"\n      let-eventClicked=\"eventClicked\"\n      let-tooltipTemplate=\"tooltipTemplate\"\n      let-tooltipAppendToBody=\"tooltipAppendToBody\"\n      let-tooltipDisabled=\"tooltipDisabled\">\n      <div\n        class=\"cal-event\"\n        [style.backgroundColor]=\"weekEvent.event.color?.secondary\"\n        [style.borderColor]=\"weekEvent.event.color?.primary\"\n        [mwlCalendarTooltip]=\"!tooltipDisabled ? (weekEvent.event.title | calendarEventTitle:'weekTooltip':weekEvent.event) : ''\"\n        [tooltipPlacement]=\"tooltipPlacement\"\n        [tooltipEvent]=\"weekEvent.event\"\n        [tooltipTemplate]=\"tooltipTemplate\"\n        [tooltipAppendToBody]=\"tooltipAppendToBody\"\n        (mwlClick)=\"eventClicked.emit()\">\n        <mwl-calendar-event-actions\n          [event]=\"weekEvent.event\"\n          [customTemplate]=\"eventActionsTemplate\">\n        </mwl-calendar-event-actions>\n        &ngsp;\n        <mwl-calendar-event-title\n          [event]=\"weekEvent.event\"\n          [customTemplate]=\"eventTitleTemplate\"\n          view=\"week\">\n        </mwl-calendar-event-title>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        weekEvent: weekEvent,\n        tooltipPlacement: tooltipPlacement,\n        eventClicked: eventClicked,\n        tooltipTemplate: tooltipTemplate,\n        tooltipAppendToBody: tooltipAppendToBody,\n        tooltipDisabled: tooltipDisabled\n      }\">\n    </ng-template>\n  "
                    }] }
        ];
        CalendarWeekViewEventComponent.propDecorators = {
            weekEvent: [{ type: core.Input }],
            tooltipPlacement: [{ type: core.Input }],
            tooltipAppendToBody: [{ type: core.Input }],
            tooltipDisabled: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }],
            eventTitleTemplate: [{ type: core.Input }],
            eventActionsTemplate: [{ type: core.Input }],
            tooltipTemplate: [{ type: core.Input }],
            eventClicked: [{ type: core.Output }]
        };
        return CalendarWeekViewEventComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarWeekViewHourSegmentComponent = /** @class */ (function () {
        function CalendarWeekViewHourSegmentComponent() {
        }
        CalendarWeekViewHourSegmentComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-week-view-hour-segment',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-segment=\"segment\"\n      let-locale=\"locale\"\n      let-segmentHeight=\"segmentHeight\"\n      let-isTimeLabel=\"isTimeLabel\">\n      <div\n        class=\"cal-hour-segment\"\n        [style.height.px]=\"segmentHeight\"\n        [class.cal-hour-start]=\"segment.isStart\"\n        [class.cal-after-hour-start]=\"!segment.isStart\"\n        [ngClass]=\"segment.cssClass\">\n        <div class=\"cal-time\" *ngIf=\"isTimeLabel\">\n          {{ segment.date | calendarDate:'weekViewHour':locale }}\n        </div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        segment: segment,\n        locale: locale,\n        segmentHeight: segmentHeight,\n        isTimeLabel: isTimeLabel\n      }\">\n    </ng-template>\n  "
                    }] }
        ];
        CalendarWeekViewHourSegmentComponent.propDecorators = {
            segment: [{ type: core.Input }],
            segmentHeight: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            isTimeLabel: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }]
        };
        return CalendarWeekViewHourSegmentComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarWeekModule = /** @class */ (function () {
        function CalendarWeekModule() {
        }
        CalendarWeekModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            angularResizableElement.ResizableModule,
                            angularDraggableDroppable.DragAndDropModule,
                            CalendarCommonModule
                        ],
                        declarations: [
                            CalendarWeekViewComponent,
                            CalendarWeekViewHeaderComponent,
                            CalendarWeekViewEventComponent,
                            CalendarWeekViewHourSegmentComponent
                        ],
                        exports: [
                            angularResizableElement.ResizableModule,
                            angularDraggableDroppable.DragAndDropModule,
                            CalendarWeekViewComponent,
                            CalendarWeekViewHeaderComponent,
                            CalendarWeekViewEventComponent,
                            CalendarWeekViewHourSegmentComponent
                        ]
                    },] }
        ];
        return CalendarWeekModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Shows all events on a given day. Example usage:
     *
     * ```typescript
     * <mwl-calendar-day-view
     *  [viewDate]="viewDate"
     *  [events]="events">
     * </mwl-calendar-day-view>
     * ```
     */
    var CalendarDayViewComponent = /** @class */ (function () {
        /**
         * @hidden
         */
        function CalendarDayViewComponent(cdr, utils, locale, dateAdapter) {
            this.cdr = cdr;
            this.utils = utils;
            this.dateAdapter = dateAdapter;
            /**
             * An array of events to display on view
             * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
             */
            this.events = [];
            /**
             * The number of segments in an hour. Must be <= 6
             */
            this.hourSegments = 2;
            /**
             * The height in pixels of each hour segment
             */
            this.hourSegmentHeight = 30;
            /**
             * The day start hours in 24 hour time. Must be 0-23
             */
            this.dayStartHour = 0;
            /**
             * The day start minutes. Must be 0-59
             */
            this.dayStartMinute = 0;
            /**
             * The day end hours in 24 hour time. Must be 0-23
             */
            this.dayEndHour = 23;
            /**
             * The day end minutes. Must be 0-59
             */
            this.dayEndMinute = 59;
            /**
             * The width in pixels of each event on the view
             */
            this.eventWidth = 150;
            /**
             * The placement of the event tooltip
             */
            this.tooltipPlacement = 'auto';
            /**
             * Whether to append tooltips to the body or next to the trigger element
             */
            this.tooltipAppendToBody = true;
            /**
             * Whether to snap events to a grid when dragging
             */
            this.snapDraggedEvents = true;
            /**
             * Called when an event title is clicked
             */
            this.eventClicked = new core.EventEmitter();
            /**
             * Called when an hour segment is clicked
             */
            this.hourSegmentClicked = new core.EventEmitter();
            /**
             * Called when an event is resized or dragged and dropped
             */
            this.eventTimesChanged = new core.EventEmitter();
            /**
             * An output that will be called before the view is rendered for the current day.
             * If you add the `cssClass` property to an hour grid segment it will add that class to the hour segment in the template
             */
            this.beforeViewRender = new core.EventEmitter();
            /**
             * @hidden
             */
            this.hours = [];
            /**
             * @hidden
             */
            this.width = 0;
            /**
             * @hidden
             */
            this.currentResizes = new Map();
            /**
             * @hidden
             */
            this.eventDragEnter = 0;
            /**
             * @hidden
             */
            this.calendarId = Symbol('angular calendar day view id');
            /**
             * @hidden
             */
            this.trackByEventId = trackByEventId;
            /**
             * @hidden
             */
            this.trackByHour = trackByHour;
            /**
             * @hidden
             */
            this.trackByHourSegment = trackByHourSegment;
            /**
             * @hidden
             */
            this.trackByDayEvent = trackByDayOrWeekEvent;
            this.locale = locale;
        }
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarDayViewComponent.prototype.ngOnInit = /**
         * @hidden
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.refresh) {
                    this.refreshSubscription = this.refresh.subscribe(function () {
                        _this.refreshAll();
                        _this.cdr.markForCheck();
                    });
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarDayViewComponent.prototype.ngOnDestroy = /**
         * @hidden
         * @return {?}
         */
            function () {
                if (this.refreshSubscription) {
                    this.refreshSubscription.unsubscribe();
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} changes
         * @return {?}
         */
        CalendarDayViewComponent.prototype.ngOnChanges = /**
         * @hidden
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes.viewDate ||
                    changes.dayStartHour ||
                    changes.dayStartMinute ||
                    changes.dayEndHour ||
                    changes.dayEndMinute ||
                    changes.hourSegments) {
                    this.refreshHourGrid();
                }
                if (changes.events) {
                    validateEvents(this.events);
                }
                if (changes.viewDate ||
                    changes.events ||
                    changes.dayStartHour ||
                    changes.dayStartMinute ||
                    changes.dayEndHour ||
                    changes.dayEndMinute ||
                    changes.eventWidth) {
                    this.refreshView();
                }
            };
        /**
         * @param {?} dropEvent
         * @param {?} date
         * @param {?} allDay
         * @return {?}
         */
        CalendarDayViewComponent.prototype.eventDropped = /**
         * @param {?} dropEvent
         * @param {?} date
         * @param {?} allDay
         * @return {?}
         */
            function (dropEvent, date, allDay) {
                if (shouldFireDroppedEvent(dropEvent, date, allDay, this.calendarId)) {
                    this.eventTimesChanged.emit({
                        type: CalendarEventTimesChangedEventType.Drop,
                        event: dropEvent.dropData.event,
                        newStart: date,
                        allDay: allDay
                    });
                }
            };
        /**
         * @param {?} event
         * @param {?} resizeEvent
         * @param {?} dayEventsContainer
         * @return {?}
         */
        CalendarDayViewComponent.prototype.resizeStarted = /**
         * @param {?} event
         * @param {?} resizeEvent
         * @param {?} dayEventsContainer
         * @return {?}
         */
            function (event, resizeEvent, dayEventsContainer) {
                this.currentResizes.set(event, {
                    originalTop: event.top,
                    originalHeight: event.height,
                    edge: typeof resizeEvent.edges.top !== 'undefined' ? 'top' : 'bottom'
                });
                /** @type {?} */
                var resizeHelper = new CalendarResizeHelper(dayEventsContainer);
                this.validateResize = function (_a) {
                    var rectangle = _a.rectangle;
                    return resizeHelper.validateResize({ rectangle: rectangle });
                };
                this.cdr.markForCheck();
            };
        /**
         * @param {?} event
         * @param {?} resizeEvent
         * @return {?}
         */
        CalendarDayViewComponent.prototype.resizing = /**
         * @param {?} event
         * @param {?} resizeEvent
         * @return {?}
         */
            function (event, resizeEvent) {
                /** @type {?} */
                var currentResize = this.currentResizes.get(event);
                if (resizeEvent.edges.top) {
                    event.top = currentResize.originalTop + +resizeEvent.edges.top;
                    event.height = currentResize.originalHeight - +resizeEvent.edges.top;
                }
                else if (resizeEvent.edges.bottom) {
                    event.height = currentResize.originalHeight + +resizeEvent.edges.bottom;
                }
            };
        /**
         * @param {?} dayEvent
         * @return {?}
         */
        CalendarDayViewComponent.prototype.resizeEnded = /**
         * @param {?} dayEvent
         * @return {?}
         */
            function (dayEvent) {
                /** @type {?} */
                var currentResize = this.currentResizes.get(dayEvent);
                /** @type {?} */
                var resizingBeforeStart = currentResize.edge === 'top';
                /** @type {?} */
                var pixelsMoved;
                if (resizingBeforeStart) {
                    pixelsMoved = dayEvent.top - currentResize.originalTop;
                }
                else {
                    pixelsMoved = dayEvent.height - currentResize.originalHeight;
                }
                dayEvent.top = currentResize.originalTop;
                dayEvent.height = currentResize.originalHeight;
                /** @type {?} */
                var minutesMoved = getMinutesMoved(pixelsMoved, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize);
                /** @type {?} */
                var newStart = dayEvent.event.start;
                /** @type {?} */
                var newEnd = getDefaultEventEnd(this.dateAdapter, dayEvent.event, getMinimumEventHeightInMinutes(this.hourSegments, this.hourSegmentHeight));
                if (resizingBeforeStart) {
                    newStart = this.dateAdapter.addMinutes(newStart, minutesMoved);
                }
                else {
                    newEnd = this.dateAdapter.addMinutes(newEnd, minutesMoved);
                }
                this.eventTimesChanged.emit({
                    newStart: newStart,
                    newEnd: newEnd,
                    event: dayEvent.event,
                    type: CalendarEventTimesChangedEventType.Resize
                });
                this.currentResizes.delete(dayEvent);
            };
        /**
         * @param {?} event
         * @param {?} dayEventsContainer
         * @return {?}
         */
        CalendarDayViewComponent.prototype.dragStarted = /**
         * @param {?} event
         * @param {?} dayEventsContainer
         * @return {?}
         */
            function (event, dayEventsContainer) {
                var _this = this;
                /** @type {?} */
                var dragHelper = new CalendarDragHelper(dayEventsContainer, event);
                this.validateDrag = function (_a) {
                    var x = _a.x, y = _a.y;
                    return _this.currentResizes.size === 0 &&
                        dragHelper.validateDrag({
                            x: x,
                            y: y,
                            snapDraggedEvents: _this.snapDraggedEvents
                        });
                };
                this.eventDragEnter = 0;
                this.cdr.markForCheck();
            };
        /**
         * @param {?} dayEvent
         * @param {?} dragEndEvent
         * @return {?}
         */
        CalendarDayViewComponent.prototype.dragEnded = /**
         * @param {?} dayEvent
         * @param {?} dragEndEvent
         * @return {?}
         */
            function (dayEvent, dragEndEvent) {
                if (this.eventDragEnter > 0) {
                    /** @type {?} */
                    var minutesMoved = getMinutesMoved(dragEndEvent.y, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize);
                    /** @type {?} */
                    var newStart = this.dateAdapter.addMinutes(dayEvent.event.start, minutesMoved);
                    if (dragEndEvent.y < 0 && newStart < this.view.period.start) {
                        minutesMoved += this.dateAdapter.differenceInMinutes(this.view.period.start, newStart);
                        newStart = this.view.period.start;
                    }
                    /** @type {?} */
                    var newEnd = void 0;
                    if (dayEvent.event.end) {
                        newEnd = this.dateAdapter.addMinutes(dayEvent.event.end, minutesMoved);
                    }
                    if (isDraggedWithinPeriod(newStart, newEnd, this.view.period)) {
                        this.eventTimesChanged.emit({
                            newStart: newStart,
                            newEnd: newEnd,
                            event: dayEvent.event,
                            type: CalendarEventTimesChangedEventType.Drag,
                            allDay: false
                        });
                    }
                }
            };
        /**
         * @return {?}
         */
        CalendarDayViewComponent.prototype.refreshHourGrid = /**
         * @return {?}
         */
            function () {
                this.hours = this.utils.getDayViewHourGrid({
                    viewDate: this.viewDate,
                    hourSegments: this.hourSegments,
                    dayStart: {
                        hour: this.dayStartHour,
                        minute: this.dayStartMinute
                    },
                    dayEnd: {
                        hour: this.dayEndHour,
                        minute: this.dayEndMinute
                    }
                });
                this.emitBeforeViewRender();
            };
        /**
         * @return {?}
         */
        CalendarDayViewComponent.prototype.refreshView = /**
         * @return {?}
         */
            function () {
                this.view = this.utils.getDayView({
                    events: this.events,
                    viewDate: this.viewDate,
                    hourSegments: this.hourSegments,
                    dayStart: {
                        hour: this.dayStartHour,
                        minute: this.dayStartMinute
                    },
                    dayEnd: {
                        hour: this.dayEndHour,
                        minute: this.dayEndMinute
                    },
                    eventWidth: this.eventWidth,
                    segmentHeight: this.hourSegmentHeight
                });
                this.emitBeforeViewRender();
            };
        /**
         * @return {?}
         */
        CalendarDayViewComponent.prototype.refreshAll = /**
         * @return {?}
         */
            function () {
                this.refreshHourGrid();
                this.refreshView();
            };
        /**
         * @return {?}
         */
        CalendarDayViewComponent.prototype.emitBeforeViewRender = /**
         * @return {?}
         */
            function () {
                if (this.hours && this.view) {
                    this.beforeViewRender.emit({
                        body: {
                            hourGrid: this.hours,
                            allDayEvents: this.view.allDayEvents
                        },
                        period: this.view.period
                    });
                }
            };
        CalendarDayViewComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-day-view',
                        template: "\n    <div class=\"cal-day-view\">\n      <div\n        class=\"cal-all-day-events\"\n        mwlDroppable\n        dragOverClass=\"cal-drag-over\"\n        dragActiveClass=\"cal-drag-active\"\n        (drop)=\"eventDropped($event, view.period.start, true)\">\n        <mwl-calendar-day-view-event\n          *ngFor=\"let event of view.allDayEvents; trackBy:trackByEventId\"\n          [ngClass]=\"event.cssClass\"\n          [dayEvent]=\"{event: event}\"\n          [tooltipPlacement]=\"tooltipPlacement\"\n          [tooltipTemplate]=\"tooltipTemplate\"\n          [tooltipAppendToBody]=\"tooltipAppendToBody\"\n          [customTemplate]=\"eventTemplate\"\n          [eventTitleTemplate]=\"eventTitleTemplate\"\n          [eventActionsTemplate]=\"eventActionsTemplate\"\n          (eventClicked)=\"eventClicked.emit({event: event})\"\n          [class.cal-draggable]=\"!snapDraggedEvents && event.draggable\"\n          mwlDraggable\n          dragActiveClass=\"cal-drag-active\"\n          [dropData]=\"{event: event, calendarId: calendarId}\"\n          [dragAxis]=\"{x: !snapDraggedEvents && event.draggable, y: !snapDraggedEvents && event.draggable}\">\n        </mwl-calendar-day-view-event>\n      </div>\n      <div\n        class=\"cal-hour-rows\"\n        #dayEventsContainer\n        mwlDroppable\n        (dragEnter)=\"eventDragEnter = eventDragEnter + 1\"\n        (dragLeave)=\"eventDragEnter = eventDragEnter - 1\">\n        <div class=\"cal-events\">\n          <div\n            #event\n            *ngFor=\"let dayEvent of view?.events; trackBy:trackByDayEvent\"\n            class=\"cal-event-container\"\n            [class.cal-draggable]=\"dayEvent.event.draggable\"\n            [class.cal-starts-within-day]=\"!dayEvent.startsBeforeDay\"\n            [class.cal-ends-within-day]=\"!dayEvent.endsAfterDay\"\n            [ngClass]=\"dayEvent.event.cssClass\"\n            mwlResizable\n            [resizeSnapGrid]=\"{top: eventSnapSize || hourSegmentHeight, bottom: eventSnapSize || hourSegmentHeight}\"\n            [validateResize]=\"validateResize\"\n            (resizeStart)=\"resizeStarted(dayEvent, $event, dayEventsContainer)\"\n            (resizing)=\"resizing(dayEvent, $event)\"\n            (resizeEnd)=\"resizeEnded(dayEvent)\"\n            mwlDraggable\n            dragActiveClass=\"cal-drag-active\"\n            [dropData]=\"{event: dayEvent.event, calendarId: calendarId}\"\n            [dragAxis]=\"{x: !snapDraggedEvents && dayEvent.event.draggable && currentResizes.size === 0, y: dayEvent.event.draggable && currentResizes.size === 0}\"\n            [dragSnapGrid]=\"snapDraggedEvents ? {y: eventSnapSize || hourSegmentHeight} : {}\"\n            [validateDrag]=\"validateDrag\"\n            (dragPointerDown)=\"dragStarted(event, dayEventsContainer)\"\n            (dragEnd)=\"dragEnded(dayEvent, $event)\"\n            [style.marginTop.px]=\"dayEvent.top\"\n            [style.height.px]=\"dayEvent.height\"\n            [style.marginLeft.px]=\"dayEvent.left + 70\"\n            [style.width.px]=\"dayEvent.width - 1\">\n            <div\n              class=\"cal-resize-handle cal-resize-handle-before-start\"\n              *ngIf=\"dayEvent.event?.resizable?.beforeStart && !dayEvent.startsBeforeDay\"\n              mwlResizeHandle\n              [resizeEdges]=\"{ top: true }\">\n            </div>\n            <mwl-calendar-day-view-event\n              [dayEvent]=\"dayEvent\"\n              [tooltipPlacement]=\"tooltipPlacement\"\n              [tooltipTemplate]=\"tooltipTemplate\"\n              [tooltipAppendToBody]=\"tooltipAppendToBody\"\n              [customTemplate]=\"eventTemplate\"\n              [eventTitleTemplate]=\"eventTitleTemplate\"\n              [eventActionsTemplate]=\"eventActionsTemplate\"\n              (eventClicked)=\"eventClicked.emit({event: dayEvent.event})\">\n            </mwl-calendar-day-view-event>\n            <div\n              class=\"cal-resize-handle cal-resize-handle-after-end\"\n              *ngIf=\"dayEvent.event?.resizable?.afterEnd && !dayEvent.endsAfterDay\"\n              mwlResizeHandle\n              [resizeEdges]=\"{ bottom: true }\">\n            </div>\n          </div>\n        </div>\n        <div class=\"cal-hour\" *ngFor=\"let hour of hours; trackBy:trackByHour\" [style.minWidth.px]=\"view?.width + 70\">\n          <mwl-calendar-day-view-hour-segment\n            *ngFor=\"let segment of hour.segments; trackBy:trackByHourSegment\"\n            [style.height.px]=\"hourSegmentHeight\"\n            [segment]=\"segment\"\n            [segmentHeight]=\"hourSegmentHeight\"\n            [locale]=\"locale\"\n            [customTemplate]=\"hourSegmentTemplate\"\n            (mwlClick)=\"hourSegmentClicked.emit({date: segment.date})\"\n            mwlDroppable\n            dragOverClass=\"cal-drag-over\"\n            dragActiveClass=\"cal-drag-active\"\n            (drop)=\"eventDropped($event, segment.date, false)\">\n          </mwl-calendar-day-view-hour-segment>\n        </div>\n      </div>\n    </div>\n  "
                    }] }
        ];
        /** @nocollapse */
        CalendarDayViewComponent.ctorParameters = function () {
            return [
                { type: core.ChangeDetectorRef },
                { type: CalendarUtils },
                { type: String, decorators: [{ type: core.Inject, args: [core.LOCALE_ID,] }] },
                { type: DateAdapter }
            ];
        };
        CalendarDayViewComponent.propDecorators = {
            viewDate: [{ type: core.Input }],
            events: [{ type: core.Input }],
            hourSegments: [{ type: core.Input }],
            hourSegmentHeight: [{ type: core.Input }],
            dayStartHour: [{ type: core.Input }],
            dayStartMinute: [{ type: core.Input }],
            dayEndHour: [{ type: core.Input }],
            dayEndMinute: [{ type: core.Input }],
            eventWidth: [{ type: core.Input }],
            refresh: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            eventSnapSize: [{ type: core.Input }],
            tooltipPlacement: [{ type: core.Input }],
            tooltipTemplate: [{ type: core.Input }],
            tooltipAppendToBody: [{ type: core.Input }],
            hourSegmentTemplate: [{ type: core.Input }],
            eventTemplate: [{ type: core.Input }],
            eventTitleTemplate: [{ type: core.Input }],
            eventActionsTemplate: [{ type: core.Input }],
            snapDraggedEvents: [{ type: core.Input }],
            eventClicked: [{ type: core.Output }],
            hourSegmentClicked: [{ type: core.Output }],
            eventTimesChanged: [{ type: core.Output }],
            beforeViewRender: [{ type: core.Output }]
        };
        return CalendarDayViewComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarDayViewHourSegmentComponent = /** @class */ (function () {
        function CalendarDayViewHourSegmentComponent() {
        }
        CalendarDayViewHourSegmentComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-day-view-hour-segment',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-segment=\"segment\"\n      let-locale=\"locale\"\n      let-segmentHeight=\"segmentHeight\">\n      <div\n        class=\"cal-hour-segment\"\n        [style.height.px]=\"segmentHeight\"\n        [class.cal-hour-start]=\"segment.isStart\"\n        [class.cal-after-hour-start]=\"!segment.isStart\"\n        [ngClass]=\"segment.cssClass\">\n        <div class=\"cal-time\">\n          {{ segment.date | calendarDate:'dayViewHour':locale }}\n        </div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        segment: segment,\n        locale: locale,\n        segmentHeight: segmentHeight\n      }\">\n    </ng-template>\n  "
                    }] }
        ];
        CalendarDayViewHourSegmentComponent.propDecorators = {
            segment: [{ type: core.Input }],
            segmentHeight: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }]
        };
        return CalendarDayViewHourSegmentComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarDayViewEventComponent = /** @class */ (function () {
        function CalendarDayViewEventComponent() {
            this.eventClicked = new core.EventEmitter();
        }
        CalendarDayViewEventComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'mwl-calendar-day-view-event',
                        template: "\n    <ng-template\n      #defaultTemplate\n      let-dayEvent=\"dayEvent\"\n      let-tooltipPlacement=\"tooltipPlacement\"\n      let-eventClicked=\"eventClicked\"\n      let-tooltipTemplate=\"tooltipTemplate\"\n      let-tooltipAppendToBody=\"tooltipAppendToBody\">\n      <div\n        class=\"cal-event\"\n        [style.backgroundColor]=\"dayEvent.event.color?.secondary\"\n        [style.borderColor]=\"dayEvent.event.color?.primary\"\n        [mwlCalendarTooltip]=\"dayEvent.event.title | calendarEventTitle:'dayTooltip':dayEvent.event\"\n        [tooltipPlacement]=\"tooltipPlacement\"\n        [tooltipEvent]=\"dayEvent.event\"\n        [tooltipTemplate]=\"tooltipTemplate\"\n        [tooltipAppendToBody]=\"tooltipAppendToBody\"\n        (mwlClick)=\"eventClicked.emit()\">\n        <mwl-calendar-event-actions\n          [event]=\"dayEvent.event\"\n          [customTemplate]=\"eventActionsTemplate\">\n        </mwl-calendar-event-actions>\n        &ngsp;\n        <mwl-calendar-event-title\n          [event]=\"dayEvent.event\"\n          [customTemplate]=\"eventTitleTemplate\"\n          view=\"day\">\n        </mwl-calendar-event-title>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        dayEvent: dayEvent,\n        tooltipPlacement: tooltipPlacement,\n        eventClicked: eventClicked,\n        tooltipTemplate: tooltipTemplate,\n        tooltipAppendToBody: tooltipAppendToBody\n      }\">\n    </ng-template>\n  "
                    }] }
        ];
        CalendarDayViewEventComponent.propDecorators = {
            dayEvent: [{ type: core.Input }],
            tooltipPlacement: [{ type: core.Input }],
            tooltipAppendToBody: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }],
            eventTitleTemplate: [{ type: core.Input }],
            eventActionsTemplate: [{ type: core.Input }],
            tooltipTemplate: [{ type: core.Input }],
            eventClicked: [{ type: core.Output }]
        };
        return CalendarDayViewEventComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarDayModule = /** @class */ (function () {
        function CalendarDayModule() {
        }
        CalendarDayModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            angularResizableElement.ResizableModule,
                            angularDraggableDroppable.DragAndDropModule,
                            CalendarCommonModule
                        ],
                        declarations: [
                            CalendarDayViewComponent,
                            CalendarDayViewHourSegmentComponent,
                            CalendarDayViewEventComponent
                        ],
                        exports: [
                            angularResizableElement.ResizableModule,
                            angularDraggableDroppable.DragAndDropModule,
                            CalendarDayViewComponent,
                            CalendarDayViewHourSegmentComponent,
                            CalendarDayViewEventComponent
                        ]
                    },] }
        ];
        return CalendarDayModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * The main module of this library. Example usage:
     *
     * ```typescript
     * import { CalenderModule } from 'angular-calendar';
     *
     * \@NgModule({
     *   imports: [
     *     CalenderModule.forRoot()
     *   ]
     * })
     * class MyModule {}
     * ```
     *
     */
    var CalendarModule = /** @class */ (function () {
        function CalendarModule() {
        }
        /**
         * @param {?} dateAdapter
         * @param {?=} config
         * @return {?}
         */
        CalendarModule.forRoot = /**
         * @param {?} dateAdapter
         * @param {?=} config
         * @return {?}
         */
            function (dateAdapter, config) {
                if (config === void 0) {
                    config = {};
                }
                return {
                    ngModule: CalendarModule,
                    providers: [
                        dateAdapter,
                        config.eventTitleFormatter || CalendarEventTitleFormatter,
                        config.dateFormatter || CalendarDateFormatter,
                        config.utils || CalendarUtils
                    ]
                };
            };
        CalendarModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            CalendarCommonModule,
                            CalendarMonthModule,
                            CalendarWeekModule,
                            CalendarDayModule
                        ],
                        exports: [
                            CalendarCommonModule,
                            CalendarMonthModule,
                            CalendarWeekModule,
                            CalendarDayModule
                        ]
                    },] }
        ];
        return CalendarModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.DAYS_OF_WEEK = calendarUtils.DAYS_OF_WEEK;
    exports.CalendarModule = CalendarModule;
    exports.CalendarCommonModule = CalendarCommonModule;
    exports.CalendarEventTitleFormatter = CalendarEventTitleFormatter;
    exports.MOMENT = MOMENT;
    exports.CalendarMomentDateFormatter = CalendarMomentDateFormatter;
    exports.CalendarNativeDateFormatter = CalendarNativeDateFormatter;
    exports.CalendarAngularDateFormatter = CalendarAngularDateFormatter;
    exports.CalendarDateFormatter = CalendarDateFormatter;
    exports.CalendarUtils = CalendarUtils;
    exports.CalendarEventTimesChangedEventType = CalendarEventTimesChangedEventType;
    exports.DateAdapter = DateAdapter;
    exports.CalendarView = CalendarView;
    exports.CalendarMonthViewComponent = CalendarMonthViewComponent;
    exports.collapseAnimation = collapseAnimation;
    exports.CalendarMonthModule = CalendarMonthModule;
    exports.CalendarWeekViewComponent = CalendarWeekViewComponent;
    exports.getWeekViewPeriod = getWeekViewPeriod;
    exports.CalendarWeekModule = CalendarWeekModule;
    exports.CalendarDayViewComponent = CalendarDayViewComponent;
    exports.CalendarDayModule = CalendarDayModule;
    exports.ɵi = CalendarDatePipe;
    exports.ɵb = CalendarEventActionsComponent;
    exports.ɵc = CalendarEventTitleComponent;
    exports.ɵj = CalendarEventTitlePipe;
    exports.ɵg = CalendarNextViewDirective;
    exports.ɵf = CalendarPreviousViewDirective;
    exports.ɵh = CalendarTodayDirective;
    exports.ɵe = CalendarTooltipDirective;
    exports.ɵd = CalendarTooltipWindowComponent;
    exports.ɵk = ClickDirective;
    exports.ɵr = CalendarDayViewEventComponent;
    exports.ɵq = CalendarDayViewHourSegmentComponent;
    exports.ɵl = CalendarMonthCellComponent;
    exports.ɵm = CalendarMonthViewHeaderComponent;
    exports.ɵa = CalendarOpenDayEventsComponent;
    exports.ɵo = CalendarWeekViewEventComponent;
    exports.ɵn = CalendarWeekViewHeaderComponent;
    exports.ɵp = CalendarWeekViewHourSegmentComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1jYWxlbmRhci51bWQuanMubWFwIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL21vZHVsZXMvY29tbW9uL3V0aWwudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItZXZlbnQtYWN0aW9ucy5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItZXZlbnQtdGl0bGUuY29tcG9uZW50LnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL21vZHVsZXMvY29tbW9uL2NhbGVuZGFyLXRvb2x0aXAuZGlyZWN0aXZlLnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyLnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL21vZHVsZXMvY29tbW9uL2NhbGVuZGFyLXZpZXcuZW51bS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2NvbW1vbi9jYWxlbmRhci1wcmV2aW91cy12aWV3LmRpcmVjdGl2ZS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2NvbW1vbi9jYWxlbmRhci1uZXh0LXZpZXcuZGlyZWN0aXZlLnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL21vZHVsZXMvY29tbW9uL2NhbGVuZGFyLXRvZGF5LmRpcmVjdGl2ZS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2NvbW1vbi9jYWxlbmRhci1hbmd1bGFyLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyLnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL21vZHVsZXMvY29tbW9uL2NhbGVuZGFyLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyLnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL21vZHVsZXMvY29tbW9uL2NhbGVuZGFyLWRhdGUucGlwZS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2NvbW1vbi9jYWxlbmRhci1ldmVudC10aXRsZS1mb3JtYXR0ZXIucHJvdmlkZXIudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItZXZlbnQtdGl0bGUucGlwZS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2NvbW1vbi9jbGljay5kaXJlY3RpdmUudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItdXRpbHMucHJvdmlkZXIudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItbW9tZW50LWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyLnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL21vZHVsZXMvY29tbW9uL2NhbGVuZGFyLW5hdGl2ZS1kYXRlLWZvcm1hdHRlci5wcm92aWRlci50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2NvbW1vbi9jYWxlbmRhci1ldmVudC10aW1lcy1jaGFuZ2VkLWV2ZW50LmludGVyZmFjZS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2NvbW1vbi9jYWxlbmRhci1jb21tb24ubW9kdWxlLnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL21vZHVsZXMvbW9udGgvY2FsZW5kYXItbW9udGgtdmlldy5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9tb250aC9jYWxlbmRhci1tb250aC12aWV3LWhlYWRlci5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9tb250aC9jYWxlbmRhci1tb250aC1jZWxsLmNvbXBvbmVudC50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL21vbnRoL2NhbGVuZGFyLW9wZW4tZGF5LWV2ZW50cy5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9tb250aC9jYWxlbmRhci1tb250aC5tb2R1bGUudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItZHJhZy1oZWxwZXIucHJvdmlkZXIudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItcmVzaXplLWhlbHBlci5wcm92aWRlci50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL3dlZWsvY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudC50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL3dlZWsvY2FsZW5kYXItd2Vlay12aWV3LWhlYWRlci5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy93ZWVrL2NhbGVuZGFyLXdlZWstdmlldy1ldmVudC5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy93ZWVrL2NhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnQuY29tcG9uZW50LnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyL21vZHVsZXMvd2Vlay9jYWxlbmRhci13ZWVrLm1vZHVsZS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2RheS9jYWxlbmRhci1kYXktdmlldy5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9kYXkvY2FsZW5kYXItZGF5LXZpZXctaG91ci1zZWdtZW50LmNvbXBvbmVudC50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2RheS9jYWxlbmRhci1kYXktdmlldy1ldmVudC5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXIvbW9kdWxlcy9kYXkvY2FsZW5kYXItZGF5Lm1vZHVsZS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci9tb2R1bGVzL2NhbGVuZGFyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7XG4gIENhbGVuZGFyRXZlbnQsXG4gIERheVZpZXdFdmVudCxcbiAgRGF5Vmlld0hvdXIsXG4gIERheVZpZXdIb3VyU2VnbWVudCxcbiAgdmFsaWRhdGVFdmVudHMgYXMgdmFsaWRhdGVFdmVudHNXaXRob3V0TG9nLFxuICBWaWV3UGVyaW9kLFxuICBXZWVrRGF5LFxuICBXZWVrVmlld0FsbERheUV2ZW50XG59IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmltcG9ydCB7IERhdGVBZGFwdGVyIH0gZnJvbSAnLi4vLi4vZGF0ZS1hZGFwdGVycy9kYXRlLWFkYXB0ZXInO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVFdmVudHMgPSAoZXZlbnRzOiBDYWxlbmRhckV2ZW50W10pID0+IHtcbiAgY29uc3Qgd2FybiA9ICguLi5hcmdzKSA9PiBjb25zb2xlLndhcm4oJ2FuZ3VsYXItY2FsZW5kYXInLCAuLi5hcmdzKTtcbiAgcmV0dXJuIHZhbGlkYXRlRXZlbnRzV2l0aG91dExvZyhldmVudHMsIHdhcm4pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5zaWRlKG91dGVyOiBDbGllbnRSZWN0LCBpbm5lcjogQ2xpZW50UmVjdCk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIE1hdGguY2VpbChvdXRlci5sZWZ0KSA8PSBNYXRoLmNlaWwoaW5uZXIubGVmdCkgJiZcbiAgICBNYXRoLmNlaWwoaW5uZXIubGVmdCkgPD0gTWF0aC5jZWlsKG91dGVyLnJpZ2h0KSAmJlxuICAgIE1hdGguY2VpbChvdXRlci5sZWZ0KSA8PSBNYXRoLmNlaWwoaW5uZXIucmlnaHQpICYmXG4gICAgTWF0aC5jZWlsKGlubmVyLnJpZ2h0KSA8PSBNYXRoLmNlaWwob3V0ZXIucmlnaHQpICYmXG4gICAgTWF0aC5jZWlsKG91dGVyLnRvcCkgPD0gTWF0aC5jZWlsKGlubmVyLnRvcCkgJiZcbiAgICBNYXRoLmNlaWwoaW5uZXIudG9wKSA8PSBNYXRoLmNlaWwob3V0ZXIuYm90dG9tKSAmJlxuICAgIE1hdGguY2VpbChvdXRlci50b3ApIDw9IE1hdGguY2VpbChpbm5lci5ib3R0b20pICYmXG4gICAgTWF0aC5jZWlsKGlubmVyLmJvdHRvbSkgPD0gTWF0aC5jZWlsKG91dGVyLmJvdHRvbSlcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kVG9OZWFyZXN0KGFtb3VudDogbnVtYmVyLCBwcmVjaXNpb246IG51bWJlcikge1xuICByZXR1cm4gTWF0aC5yb3VuZChhbW91bnQgLyBwcmVjaXNpb24pICogcHJlY2lzaW9uO1xufVxuXG5leHBvcnQgY29uc3QgdHJhY2tCeUV2ZW50SWQgPSAoaW5kZXg6IG51bWJlciwgZXZlbnQ6IENhbGVuZGFyRXZlbnQpID0+XG4gIGV2ZW50LmlkID8gZXZlbnQuaWQgOiBldmVudDtcblxuZXhwb3J0IGNvbnN0IHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZSA9IChpbmRleDogbnVtYmVyLCBkYXk6IFdlZWtEYXkpID0+XG4gIGRheS5kYXRlLnRvSVNPU3RyaW5nKCk7XG5cbmV4cG9ydCBjb25zdCB0cmFja0J5SW5kZXggPSAoaW5kZXg6IG51bWJlcikgPT4gaW5kZXg7XG5cbmV4cG9ydCBjb25zdCB0cmFja0J5SG91clNlZ21lbnQgPSAoXG4gIGluZGV4OiBudW1iZXIsXG4gIHNlZ21lbnQ6IERheVZpZXdIb3VyU2VnbWVudFxuKSA9PiBzZWdtZW50LmRhdGUudG9JU09TdHJpbmcoKTtcblxuZXhwb3J0IGNvbnN0IHRyYWNrQnlIb3VyID0gKGluZGV4OiBudW1iZXIsIGhvdXI6IERheVZpZXdIb3VyKSA9PlxuICBob3VyLnNlZ21lbnRzWzBdLmRhdGUudG9JU09TdHJpbmcoKTtcblxuZXhwb3J0IGNvbnN0IHRyYWNrQnlEYXlPcldlZWtFdmVudCA9IChcbiAgaW5kZXg6IG51bWJlcixcbiAgd2Vla0V2ZW50OiBXZWVrVmlld0FsbERheUV2ZW50IHwgRGF5Vmlld0V2ZW50XG4pID0+ICh3ZWVrRXZlbnQuZXZlbnQuaWQgPyB3ZWVrRXZlbnQuZXZlbnQuaWQgOiB3ZWVrRXZlbnQuZXZlbnQpO1xuXG5jb25zdCBNSU5VVEVTX0lOX0hPVVIgPSA2MDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbnV0ZXNNb3ZlZChcbiAgbW92ZWRZOiBudW1iZXIsXG4gIGhvdXJTZWdtZW50czogbnVtYmVyLFxuICBob3VyU2VnbWVudEhlaWdodDogbnVtYmVyLFxuICBldmVudFNuYXBTaXplOiBudW1iZXJcbik6IG51bWJlciB7XG4gIGNvbnN0IGRyYWdnZWRJblBpeGVsc1NuYXBTaXplID0gcm91bmRUb05lYXJlc3QoXG4gICAgbW92ZWRZLFxuICAgIGV2ZW50U25hcFNpemUgfHwgaG91clNlZ21lbnRIZWlnaHRcbiAgKTtcbiAgY29uc3QgcGl4ZWxBbW91bnRJbk1pbnV0ZXMgPVxuICAgIE1JTlVURVNfSU5fSE9VUiAvIChob3VyU2VnbWVudHMgKiBob3VyU2VnbWVudEhlaWdodCk7XG4gIHJldHVybiBkcmFnZ2VkSW5QaXhlbHNTbmFwU2l6ZSAqIHBpeGVsQW1vdW50SW5NaW51dGVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWluaW11bUV2ZW50SGVpZ2h0SW5NaW51dGVzKFxuICBob3VyU2VnbWVudHM6IG51bWJlcixcbiAgaG91clNlZ21lbnRIZWlnaHQ6IG51bWJlclxuKSB7XG4gIHJldHVybiAoTUlOVVRFU19JTl9IT1VSIC8gKGhvdXJTZWdtZW50cyAqIGhvdXJTZWdtZW50SGVpZ2h0KSkgKiAzMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRFdmVudEVuZChcbiAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICBldmVudDogQ2FsZW5kYXJFdmVudCxcbiAgbWluaW11bU1pbnV0ZXM6IG51bWJlclxuKTogRGF0ZSB7XG4gIGlmIChldmVudC5lbmQpIHtcbiAgICByZXR1cm4gZXZlbnQuZW5kO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkYXRlQWRhcHRlci5hZGRNaW51dGVzKGV2ZW50LnN0YXJ0LCBtaW5pbXVtTWludXRlcyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZERheXNXaXRoRXhjbHVzaW9ucyhcbiAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICBkYXRlOiBEYXRlLFxuICBkYXlzOiBudW1iZXIsXG4gIGV4Y2x1ZGVkOiBudW1iZXJbXVxuKTogRGF0ZSB7XG4gIGxldCBkYXlzQ291bnRlciA9IDA7XG4gIGxldCBkYXlzVG9BZGQgPSAwO1xuICBjb25zdCBjaGFuZ2VEYXlzID0gZGF5cyA8IDAgPyBkYXRlQWRhcHRlci5zdWJEYXlzIDogZGF0ZUFkYXB0ZXIuYWRkRGF5cztcbiAgbGV0IHJlc3VsdCA9IGRhdGU7XG4gIHdoaWxlIChkYXlzVG9BZGQgPD0gTWF0aC5hYnMoZGF5cykpIHtcbiAgICByZXN1bHQgPSBjaGFuZ2VEYXlzKGRhdGUsIGRheXNDb3VudGVyKTtcbiAgICBjb25zdCBkYXkgPSBkYXRlQWRhcHRlci5nZXREYXkocmVzdWx0KTtcbiAgICBpZiAoZXhjbHVkZWQuaW5kZXhPZihkYXkpID09PSAtMSkge1xuICAgICAgZGF5c1RvQWRkKys7XG4gICAgfVxuICAgIGRheXNDb3VudGVyKys7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRHJhZ2dlZFdpdGhpblBlcmlvZChcbiAgbmV3U3RhcnQ6IERhdGUsXG4gIG5ld0VuZDogRGF0ZSxcbiAgcGVyaW9kOiBWaWV3UGVyaW9kXG4pOiBib29sZWFuIHtcbiAgY29uc3QgZW5kID0gbmV3RW5kIHx8IG5ld1N0YXJ0O1xuICByZXR1cm4gKFxuICAgIChwZXJpb2Quc3RhcnQgPD0gbmV3U3RhcnQgJiYgbmV3U3RhcnQgPD0gcGVyaW9kLmVuZCkgfHxcbiAgICAocGVyaW9kLnN0YXJ0IDw9IGVuZCAmJiBlbmQgPD0gcGVyaW9kLmVuZClcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZEZpcmVEcm9wcGVkRXZlbnQoXG4gIGRyb3BFdmVudDogeyBkcm9wRGF0YT86IHsgZXZlbnQ/OiBDYWxlbmRhckV2ZW50OyBjYWxlbmRhcklkPzogc3ltYm9sIH0gfSxcbiAgZGF0ZTogRGF0ZSxcbiAgYWxsRGF5OiBib29sZWFuLFxuICBjYWxlbmRhcklkOiBzeW1ib2xcbikge1xuICByZXR1cm4gKFxuICAgIGRyb3BFdmVudC5kcm9wRGF0YSAmJlxuICAgIGRyb3BFdmVudC5kcm9wRGF0YS5ldmVudCAmJlxuICAgIChkcm9wRXZlbnQuZHJvcERhdGEuY2FsZW5kYXJJZCAhPT0gY2FsZW5kYXJJZCB8fFxuICAgICAgKGRyb3BFdmVudC5kcm9wRGF0YS5ldmVudC5hbGxEYXkgJiYgIWFsbERheSkgfHxcbiAgICAgICghZHJvcEV2ZW50LmRyb3BEYXRhLmV2ZW50LmFsbERheSAmJiBhbGxEYXkpKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2Vla1ZpZXdQZXJpb2QoXG4gIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcixcbiAgdmlld0RhdGU6IERhdGUsXG4gIHdlZWtTdGFydHNPbjogbnVtYmVyLFxuICBleGNsdWRlZDogbnVtYmVyW10gPSBbXSxcbiAgZGF5c0luV2Vlaz86IG51bWJlclxuKTogeyB2aWV3U3RhcnQ6IERhdGU7IHZpZXdFbmQ6IERhdGUgfSB7XG4gIGxldCB2aWV3U3RhcnQgPSBkYXlzSW5XZWVrXG4gICAgPyBkYXRlQWRhcHRlci5zdGFydE9mRGF5KHZpZXdEYXRlKVxuICAgIDogZGF0ZUFkYXB0ZXIuc3RhcnRPZldlZWsodmlld0RhdGUsIHsgd2Vla1N0YXJ0c09uIH0pO1xuICBpZiAoZXhjbHVkZWQuaW5kZXhPZihkYXRlQWRhcHRlci5nZXREYXkodmlld1N0YXJ0KSkgPiAtMSkge1xuICAgIHZpZXdTdGFydCA9IGRhdGVBZGFwdGVyLnN1YkRheXMoXG4gICAgICBhZGREYXlzV2l0aEV4Y2x1c2lvbnMoZGF0ZUFkYXB0ZXIsIHZpZXdTdGFydCwgMSwgZXhjbHVkZWQpLFxuICAgICAgMVxuICAgICk7XG4gIH1cbiAgaWYgKGRheXNJbldlZWspIHtcbiAgICBjb25zdCB2aWV3RW5kID0gZGF0ZUFkYXB0ZXIuZW5kT2ZEYXkoXG4gICAgICBhZGREYXlzV2l0aEV4Y2x1c2lvbnMoZGF0ZUFkYXB0ZXIsIHZpZXdTdGFydCwgZGF5c0luV2VlayAtIDEsIGV4Y2x1ZGVkKVxuICAgICk7XG4gICAgcmV0dXJuIHsgdmlld1N0YXJ0LCB2aWV3RW5kIH07XG4gIH0gZWxzZSB7XG4gICAgbGV0IHZpZXdFbmQgPSBkYXRlQWRhcHRlci5lbmRPZldlZWsodmlld0RhdGUsIHsgd2Vla1N0YXJ0c09uIH0pO1xuICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGRhdGVBZGFwdGVyLmdldERheSh2aWV3RW5kKSkgPiAtMSkge1xuICAgICAgdmlld0VuZCA9IGRhdGVBZGFwdGVyLmFkZERheXMoXG4gICAgICAgIGFkZERheXNXaXRoRXhjbHVzaW9ucyhkYXRlQWRhcHRlciwgdmlld0VuZCwgLTEsIGV4Y2x1ZGVkKSxcbiAgICAgICAgMVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdmlld1N0YXJ0LCB2aWV3RW5kIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50IH0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgdHJhY2tCeUluZGV4IH0gZnJvbSAnLi91dGlsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLWV2ZW50LWFjdGlvbnMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWV2ZW50PVwiZXZlbnRcIj5cbiAgICAgIDxzcGFuICpuZ0lmPVwiZXZlbnQuYWN0aW9uc1wiIGNsYXNzPVwiY2FsLWV2ZW50LWFjdGlvbnNcIj5cbiAgICAgICAgPGFcbiAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1hY3Rpb25cIlxuICAgICAgICAgIGhyZWY9XCJqYXZhc2NyaXB0OjtcIlxuICAgICAgICAgICpuZ0Zvcj1cImxldCBhY3Rpb24gb2YgZXZlbnQuYWN0aW9uczsgdHJhY2tCeTp0cmFja0J5SW5kZXhcIlxuICAgICAgICAgIChtd2xDbGljayk9XCJhY3Rpb24ub25DbGljayh7ZXZlbnQ6IGV2ZW50fSlcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cImFjdGlvbi5jc3NDbGFzc1wiXG4gICAgICAgICAgW2lubmVySHRtbF09XCJhY3Rpb24ubGFiZWxcIj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9zcGFuPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICB9XCI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckV2ZW50QWN0aW9uc0NvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIGV2ZW50OiBDYWxlbmRhckV2ZW50O1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIHRyYWNrQnlJbmRleCA9IHRyYWNrQnlJbmRleDtcbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50IH0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItZXZlbnQtdGl0bGUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWV2ZW50PVwiZXZlbnRcIlxuICAgICAgbGV0LXZpZXc9XCJ2aWV3XCI+XG4gICAgICA8c3BhblxuICAgICAgICBjbGFzcz1cImNhbC1ldmVudC10aXRsZVwiXG4gICAgICAgIFtpbm5lckhUTUxdPVwiZXZlbnQudGl0bGUgfCBjYWxlbmRhckV2ZW50VGl0bGU6dmlldzpldmVudFwiPlxuICAgICAgPC9zcGFuPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICB2aWV3OiB2aWV3XG4gICAgICB9XCI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckV2ZW50VGl0bGVDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBldmVudDogQ2FsZW5kYXJFdmVudDtcblxuICBASW5wdXQoKVxuICBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKVxuICB2aWV3OiBzdHJpbmc7XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIENvbXBvbmVudCxcbiAgSG9zdExpc3RlbmVyLFxuICBPbkRlc3Ryb3ksXG4gIElucHV0LFxuICBDb21wb25lbnRSZWYsXG4gIEluamVjdG9yLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIENvbXBvbmVudEZhY3RvcnksXG4gIEluamVjdCxcbiAgUmVuZGVyZXIyLFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFBsYWNlbWVudEFycmF5LCBwb3NpdGlvbkVsZW1lbnRzIH0gZnJvbSAncG9zaXRpb25pbmcnO1xuaW1wb3J0IHsgQ2FsZW5kYXJFdmVudCB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLXRvb2x0aXAtd2luZG93JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICNkZWZhdWx0VGVtcGxhdGVcbiAgICAgIGxldC1jb250ZW50cz1cImNvbnRlbnRzXCJcbiAgICAgIGxldC1wbGFjZW1lbnQ9XCJwbGFjZW1lbnRcIlxuICAgICAgbGV0LWV2ZW50PVwiZXZlbnRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjYWwtdG9vbHRpcFwiIFtuZ0NsYXNzXT1cIidjYWwtdG9vbHRpcC0nICsgcGxhY2VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtdG9vbHRpcC1hcnJvd1wiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXRvb2x0aXAtaW5uZXJcIiBbaW5uZXJIdG1sXT1cImNvbnRlbnRzXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgIGNvbnRlbnRzOiBjb250ZW50cyxcbiAgICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgfVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgY29udGVudHM6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBwbGFjZW1lbnQ6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBldmVudDogQ2FsZW5kYXJFdmVudDtcblxuICBASW5wdXQoKVxuICBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pjtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bENhbGVuZGFyVG9vbHRpcF0nXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyVG9vbHRpcERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnbXdsQ2FsZW5kYXJUb29sdGlwJylcbiAgY29udGVudHM6IHN0cmluZzsgLy8gdHNsaW50OmRpc2FibGUtbGluZSBuby1pbnB1dC1yZW5hbWVcblxuICBASW5wdXQoJ3Rvb2x0aXBQbGFjZW1lbnQnKVxuICBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5ID0gJ2F1dG8nOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lIG5vLWlucHV0LXJlbmFtZVxuXG4gIEBJbnB1dCgndG9vbHRpcFRlbXBsYXRlJylcbiAgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47IC8vIHRzbGludDpkaXNhYmxlLWxpbmUgbm8taW5wdXQtcmVuYW1lXG5cbiAgQElucHV0KCd0b29sdGlwRXZlbnQnKVxuICBldmVudDogQ2FsZW5kYXJFdmVudDsgLy8gdHNsaW50OmRpc2FibGUtbGluZSBuby1pbnB1dC1yZW5hbWVcblxuICBASW5wdXQoJ3Rvb2x0aXBBcHBlbmRUb0JvZHknKVxuICBhcHBlbmRUb0JvZHk6IGJvb2xlYW47IC8vIHRzbGludDpkaXNhYmxlLWxpbmUgbm8taW5wdXQtcmVuYW1lXG5cbiAgcHJpdmF0ZSB0b29sdGlwRmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxDYWxlbmRhclRvb2x0aXBXaW5kb3dDb21wb25lbnQ+O1xuICBwcml2YXRlIHRvb2x0aXBSZWY6IENvbXBvbmVudFJlZjxDYWxlbmRhclRvb2x0aXBXaW5kb3dDb21wb25lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQgLy90c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICkge1xuICAgIHRoaXMudG9vbHRpcEZhY3RvcnkgPSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoXG4gICAgICBDYWxlbmRhclRvb2x0aXBXaW5kb3dDb21wb25lbnRcbiAgICApO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgb25Nb3VzZU92ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zaG93KCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcbiAgb25Nb3VzZU91dCgpOiB2b2lkIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvdygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudG9vbHRpcFJlZiAmJiB0aGlzLmNvbnRlbnRzKSB7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KFxuICAgICAgICB0aGlzLnRvb2x0aXBGYWN0b3J5LFxuICAgICAgICAwLFxuICAgICAgICB0aGlzLmluamVjdG9yLFxuICAgICAgICBbXVxuICAgICAgKTtcbiAgICAgIHRoaXMudG9vbHRpcFJlZi5pbnN0YW5jZS5jb250ZW50cyA9IHRoaXMuY29udGVudHM7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYuaW5zdGFuY2UuY3VzdG9tVGVtcGxhdGUgPSB0aGlzLmN1c3RvbVRlbXBsYXRlO1xuICAgICAgdGhpcy50b29sdGlwUmVmLmluc3RhbmNlLmV2ZW50ID0gdGhpcy5ldmVudDtcbiAgICAgIGlmICh0aGlzLmFwcGVuZFRvQm9keSkge1xuICAgICAgICB0aGlzLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy50b29sdGlwUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdGhpcy5wb3NpdGlvblRvb2x0aXAoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGlkZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50b29sdGlwUmVmKSB7XG4gICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYucmVtb3ZlKFxuICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuaW5kZXhPZih0aGlzLnRvb2x0aXBSZWYuaG9zdFZpZXcpXG4gICAgICApO1xuICAgICAgdGhpcy50b29sdGlwUmVmID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBvc2l0aW9uVG9vbHRpcChwcmV2aW91c1Bvc2l0aW9uPzogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudG9vbHRpcFJlZikge1xuICAgICAgdGhpcy50b29sdGlwUmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMudG9vbHRpcFJlZi5pbnN0YW5jZS5wbGFjZW1lbnQgPSBwb3NpdGlvbkVsZW1lbnRzKFxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgdGhpcy50b29sdGlwUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0sXG4gICAgICAgIHRoaXMucGxhY2VtZW50LFxuICAgICAgICB0aGlzLmFwcGVuZFRvQm9keVxuICAgICAgKTtcbiAgICAgIC8vIGtlZXAgcmUtcG9zaXRpb25pbmcgdGhlIHRvb2x0aXAgdW50aWwgdGhlIGFycm93IHBvc2l0aW9uIGRvZXNuJ3QgbWFrZSBhIGRpZmZlcmVuY2VcbiAgICAgIGlmIChwcmV2aW91c1Bvc2l0aW9uICE9PSB0aGlzLnRvb2x0aXBSZWYuaW5zdGFuY2UucGxhY2VtZW50KSB7XG4gICAgICAgIHRoaXMucG9zaXRpb25Ub29sdGlwKHRoaXMudG9vbHRpcFJlZi5pbnN0YW5jZS5wbGFjZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgYXMgQmFzZURhdGVBZGFwdGVyIH0gZnJvbSAnY2FsZW5kYXItdXRpbHMvZGF0ZS1hZGFwdGVycy9kYXRlLWFkYXB0ZXInO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGF0ZUFkYXB0ZXIgaW1wbGVtZW50cyBCYXNlRGF0ZUFkYXB0ZXIge1xuICBhYnN0cmFjdCBhZGRXZWVrcyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBhbW91bnQ6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3QgYWRkTW9udGhzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGFtb3VudDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzdWJEYXlzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGFtb3VudDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzdWJXZWVrcyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBhbW91bnQ6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3Qgc3ViTW9udGhzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGFtb3VudDogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBnZXRJU09XZWVrKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXI7XG5cbiAgYWJzdHJhY3Qgc2V0RGF0ZShkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBkYXlPZk1vbnRoOiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHNldE1vbnRoKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIG1vbnRoOiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHNldFllYXIoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgeWVhcjogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBnZXREYXRlKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXI7XG5cbiAgYWJzdHJhY3QgZ2V0TW9udGgoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IG51bWJlcjtcblxuICBhYnN0cmFjdCBnZXRZZWFyKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXI7XG5cbiAgYWJzdHJhY3QgYWRkRGF5cyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLCBhbW91bnQ6IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3QgYWRkSG91cnMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgYW1vdW50OiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGFkZE1pbnV0ZXMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgYW1vdW50OiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGFkZFNlY29uZHMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgYW1vdW50OiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGRpZmZlcmVuY2VJbkRheXMoXG4gICAgZGF0ZUxlZnQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgZGF0ZVJpZ2h0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyXG4gICk6IG51bWJlcjtcblxuICBhYnN0cmFjdCBkaWZmZXJlbmNlSW5NaW51dGVzKFxuICAgIGRhdGVMZWZ0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLFxuICAgIGRhdGVSaWdodDogRGF0ZSB8IHN0cmluZyB8IG51bWJlclxuICApOiBudW1iZXI7XG5cbiAgYWJzdHJhY3QgZGlmZmVyZW5jZUluU2Vjb25kcyhcbiAgICBkYXRlTGVmdDogRGF0ZSB8IHN0cmluZyB8IG51bWJlcixcbiAgICBkYXRlUmlnaHQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXJcbiAgKTogbnVtYmVyO1xuXG4gIGFic3RyYWN0IGVuZE9mRGF5KGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IGVuZE9mTW9udGgoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3QgZW5kT2ZXZWVrKFxuICAgIGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgb3B0aW9ucz86IHsgd2Vla1N0YXJ0c09uPzogbnVtYmVyIH1cbiAgKTogRGF0ZTtcblxuICBhYnN0cmFjdCBnZXREYXkoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IG51bWJlcjtcblxuICBhYnN0cmFjdCBpc1NhbWVEYXkoXG4gICAgZGF0ZUxlZnQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgZGF0ZVJpZ2h0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyXG4gICk6IGJvb2xlYW47XG5cbiAgYWJzdHJhY3QgaXNTYW1lTW9udGgoXG4gICAgZGF0ZUxlZnQ6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgZGF0ZVJpZ2h0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyXG4gICk6IGJvb2xlYW47XG5cbiAgYWJzdHJhY3QgaXNTYW1lU2Vjb25kKFxuICAgIGRhdGVMZWZ0OiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyLFxuICAgIGRhdGVSaWdodDogRGF0ZSB8IHN0cmluZyB8IG51bWJlclxuICApOiBib29sZWFuO1xuXG4gIGFic3RyYWN0IG1heCguLi5kYXRlczogQXJyYXk8RGF0ZSB8IHN0cmluZyB8IG51bWJlcj4pOiBEYXRlO1xuXG4gIGFic3RyYWN0IHNldEhvdXJzKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsIGhvdXJzOiBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHNldE1pbnV0ZXMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgbWludXRlczogbnVtYmVyKTogRGF0ZTtcblxuICBhYnN0cmFjdCBzdGFydE9mRGF5KGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHN0YXJ0T2ZNaW51dGUoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IERhdGU7XG5cbiAgYWJzdHJhY3Qgc3RhcnRPZk1vbnRoKGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIpOiBEYXRlO1xuXG4gIGFic3RyYWN0IHN0YXJ0T2ZXZWVrKFxuICAgIGRhdGU6IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgb3B0aW9ucz86IHsgd2Vla1N0YXJ0c09uPzogbnVtYmVyIH1cbiAgKTogRGF0ZTtcblxuICBhYnN0cmFjdCBnZXRIb3VycyhkYXRlOiBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyO1xuXG4gIGFic3RyYWN0IGdldE1pbnV0ZXMoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlcik6IG51bWJlcjtcbn1cbiIsImV4cG9ydCBlbnVtIENhbGVuZGFyVmlldyB7XG4gIE1vbnRoID0gJ21vbnRoJyxcbiAgV2VlayA9ICd3ZWVrJyxcbiAgRGF5ID0gJ2RheSdcbn1cbiIsImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7IENhbGVuZGFyVmlldyB9IGZyb20gJy4vY2FsZW5kYXItdmlldy5lbnVtJztcbmltcG9ydCB7IGFkZERheXNXaXRoRXhjbHVzaW9ucyB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQ2hhbmdlIHRoZSB2aWV3IGRhdGUgdG8gdGhlIHByZXZpb3VzIHZpZXcuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIDxidXR0b25cbiAqICBtd2xDYWxlbmRhclByZXZpb3VzVmlld1xuICogIFsodmlld0RhdGUpXT1cInZpZXdEYXRlXCJcbiAqICBbdmlld109XCJ2aWV3XCI+XG4gKiAgUHJldmlvdXNcbiAqIDwvYnV0dG9uPlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xDYWxlbmRhclByZXZpb3VzVmlld10nXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyUHJldmlvdXNWaWV3RGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZpZXdcbiAgICovXG4gIEBJbnB1dCgpXG4gIHZpZXc6IENhbGVuZGFyVmlldztcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmlldyBkYXRlXG4gICAqL1xuICBASW5wdXQoKVxuICB2aWV3RGF0ZTogRGF0ZTtcblxuICAvKipcbiAgICogRGF5cyB0byBza2lwIHdoZW4gZ29pbmcgYmFjayBieSAxIGRheVxuICAgKi9cbiAgQElucHV0KClcbiAgZXhjbHVkZURheXM6IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgZGF5cyBpbiBhIHdlZWsuIElmIHNldCB3aWxsIHN1YnRyYWN0IHRoaXMgYW1vdW50IG9mIGRheXMgaW5zdGVhZCBvZiAxIHdlZWtcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRheXNJbldlZWs6IG51bWJlcjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHZpZXcgZGF0ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgdmlld0RhdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxEYXRlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcikge31cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICBvbkNsaWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IHN1YkZuOiBhbnkgPSB7XG4gICAgICBkYXk6IHRoaXMuZGF0ZUFkYXB0ZXIuc3ViRGF5cyxcbiAgICAgIHdlZWs6IHRoaXMuZGF0ZUFkYXB0ZXIuc3ViV2Vla3MsXG4gICAgICBtb250aDogdGhpcy5kYXRlQWRhcHRlci5zdWJNb250aHNcbiAgICB9W3RoaXMudmlld107XG5cbiAgICBpZiAodGhpcy52aWV3ID09PSBDYWxlbmRhclZpZXcuRGF5KSB7XG4gICAgICB0aGlzLnZpZXdEYXRlQ2hhbmdlLmVtaXQoXG4gICAgICAgIGFkZERheXNXaXRoRXhjbHVzaW9ucyhcbiAgICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLFxuICAgICAgICAgIHRoaXMudmlld0RhdGUsXG4gICAgICAgICAgLTEsXG4gICAgICAgICAgdGhpcy5leGNsdWRlRGF5c1xuICAgICAgICApXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy52aWV3ID09PSBDYWxlbmRhclZpZXcuV2VlayAmJiB0aGlzLmRheXNJbldlZWspIHtcbiAgICAgIHRoaXMudmlld0RhdGVDaGFuZ2UuZW1pdChcbiAgICAgICAgYWRkRGF5c1dpdGhFeGNsdXNpb25zKFxuICAgICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgICAgdGhpcy52aWV3RGF0ZSxcbiAgICAgICAgICAtdGhpcy5kYXlzSW5XZWVrLFxuICAgICAgICAgIHRoaXMuZXhjbHVkZURheXNcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3RGF0ZUNoYW5nZS5lbWl0KHN1YkZuKHRoaXMudmlld0RhdGUsIDEpKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPdXRwdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7IENhbGVuZGFyVmlldyB9IGZyb20gJy4vY2FsZW5kYXItdmlldy5lbnVtJztcbmltcG9ydCB7IGFkZERheXNXaXRoRXhjbHVzaW9ucyB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQ2hhbmdlIHRoZSB2aWV3IGRhdGUgdG8gdGhlIG5leHQgdmlldy4gRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogPGJ1dHRvblxuICogIG13bENhbGVuZGFyTmV4dFZpZXdcbiAqICBbKHZpZXdEYXRlKV09XCJ2aWV3RGF0ZVwiXG4gKiAgW3ZpZXddPVwidmlld1wiPlxuICogIE5leHRcbiAqIDwvYnV0dG9uPlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xDYWxlbmRhck5leHRWaWV3XSdcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJOZXh0Vmlld0RpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB2aWV3XG4gICAqL1xuICBASW5wdXQoKVxuICB2aWV3OiBDYWxlbmRhclZpZXc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZpZXcgZGF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgdmlld0RhdGU6IERhdGU7XG5cbiAgLyoqXG4gICAqIERheXMgdG8gc2tpcCB3aGVuIGdvaW5nIGZvcndhcmQgYnkgMSBkYXlcbiAgICovXG4gIEBJbnB1dCgpXG4gIGV4Y2x1ZGVEYXlzOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGRheXMgaW4gYSB3ZWVrLiBJZiBzZXQgd2lsbCBhZGQgdGhpcyBhbW91bnQgb2YgZGF5cyBpbnN0ZWFkIG9mIDEgd2Vla1xuICAgKi9cbiAgQElucHV0KClcbiAgZGF5c0luV2VlazogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdmlldyBkYXRlIGlzIGNoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICB2aWV3RGF0ZUNoYW5nZTogRXZlbnRFbWl0dGVyPERhdGU+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyKSB7fVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgY29uc3QgYWRkRm46IGFueSA9IHtcbiAgICAgIGRheTogdGhpcy5kYXRlQWRhcHRlci5hZGREYXlzLFxuICAgICAgd2VlazogdGhpcy5kYXRlQWRhcHRlci5hZGRXZWVrcyxcbiAgICAgIG1vbnRoOiB0aGlzLmRhdGVBZGFwdGVyLmFkZE1vbnRoc1xuICAgIH1bdGhpcy52aWV3XTtcblxuICAgIGlmICh0aGlzLnZpZXcgPT09IENhbGVuZGFyVmlldy5EYXkpIHtcbiAgICAgIHRoaXMudmlld0RhdGVDaGFuZ2UuZW1pdChcbiAgICAgICAgYWRkRGF5c1dpdGhFeGNsdXNpb25zKFxuICAgICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgICAgdGhpcy52aWV3RGF0ZSxcbiAgICAgICAgICAxLFxuICAgICAgICAgIHRoaXMuZXhjbHVkZURheXNcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudmlldyA9PT0gQ2FsZW5kYXJWaWV3LldlZWsgJiYgdGhpcy5kYXlzSW5XZWVrKSB7XG4gICAgICB0aGlzLnZpZXdEYXRlQ2hhbmdlLmVtaXQoXG4gICAgICAgIGFkZERheXNXaXRoRXhjbHVzaW9ucyhcbiAgICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLFxuICAgICAgICAgIHRoaXMudmlld0RhdGUsXG4gICAgICAgICAgdGhpcy5kYXlzSW5XZWVrLFxuICAgICAgICAgIHRoaXMuZXhjbHVkZURheXNcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3RGF0ZUNoYW5nZS5lbWl0KGFkZEZuKHRoaXMudmlld0RhdGUsIDEpKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcblxuLyoqXG4gKiBDaGFuZ2UgdGhlIHZpZXcgZGF0ZSB0byB0aGUgY3VycmVudCBkYXkuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIDxidXR0b25cbiAqICBtd2xDYWxlbmRhclRvZGF5XG4gKiAgWyh2aWV3RGF0ZSldPVwidmlld0RhdGVcIj5cbiAqICBUb2RheVxuICogPC9idXR0b24+XG4gKiBgYGBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bENhbGVuZGFyVG9kYXldJ1xufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclRvZGF5RGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZpZXcgZGF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgdmlld0RhdGU6IERhdGU7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB2aWV3IGRhdGUgaXMgY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHZpZXdEYXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RGF0ZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIpIHt9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgb25DbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdEYXRlQ2hhbmdlLmVtaXQodGhpcy5kYXRlQWRhcHRlci5zdGFydE9mRGF5KG5ldyBEYXRlKCkpKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgQ2FsZW5kYXJEYXRlRm9ybWF0dGVySW50ZXJmYWNlLFxuICBEYXRlRm9ybWF0dGVyUGFyYW1zXG59IGZyb20gJy4vY2FsZW5kYXItZGF0ZS1mb3JtYXR0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IGZvcm1hdERhdGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRlLWFkYXB0ZXJzL2RhdGUtYWRhcHRlcic7XG5pbXBvcnQgeyBnZXRXZWVrVmlld1BlcmlvZCB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogVGhpcyB3aWxsIHVzZSB0aGUgYW5ndWxhciBkYXRlIHBpcGUgdG8gZG8gYWxsIGRhdGUgZm9ybWF0dGluZy4gSXQgaXMgdGhlIGRlZmF1bHQgZGF0ZSBmb3JtYXR0ZXIgdXNlZCBieSB0aGUgY2FsZW5kYXIuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckFuZ3VsYXJEYXRlRm9ybWF0dGVyXG4gIGltcGxlbWVudHMgQ2FsZW5kYXJEYXRlRm9ybWF0dGVySW50ZXJmYWNlIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcikge31cblxuICAvKipcbiAgICogVGhlIG1vbnRoIHZpZXcgaGVhZGVyIHdlZWsgZGF5IGxhYmVsc1xuICAgKi9cbiAgcHVibGljIG1vbnRoVmlld0NvbHVtbkhlYWRlcih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZm9ybWF0RGF0ZShkYXRlLCAnRUVFRScsIGxvY2FsZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1vbnRoIHZpZXcgY2VsbCBkYXkgbnVtYmVyXG4gICAqL1xuICBwdWJsaWMgbW9udGhWaWV3RGF5TnVtYmVyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBmb3JtYXREYXRlKGRhdGUsICdkJywgbG9jYWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbW9udGggdmlldyB0aXRsZVxuICAgKi9cbiAgcHVibGljIG1vbnRoVmlld1RpdGxlKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBmb3JtYXREYXRlKGRhdGUsICdMTExMIHknLCBsb2NhbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWVrIHZpZXcgaGVhZGVyIHdlZWsgZGF5IGxhYmVsc1xuICAgKi9cbiAgcHVibGljIHdlZWtWaWV3Q29sdW1uSGVhZGVyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBmb3JtYXREYXRlKGRhdGUsICdFRUVFJywgbG9jYWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgd2VlayB2aWV3IHN1YiBoZWFkZXIgZGF5IGFuZCBtb250aCBsYWJlbHNcbiAgICovXG4gIHB1YmxpYyB3ZWVrVmlld0NvbHVtblN1YkhlYWRlcih7XG4gICAgZGF0ZSxcbiAgICBsb2NhbGVcbiAgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGZvcm1hdERhdGUoZGF0ZSwgJ01NTSBkJywgbG9jYWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgd2VlayB2aWV3IHRpdGxlXG4gICAqL1xuICBwdWJsaWMgd2Vla1ZpZXdUaXRsZSh7XG4gICAgZGF0ZSxcbiAgICBsb2NhbGUsXG4gICAgd2Vla1N0YXJ0c09uLFxuICAgIGV4Y2x1ZGVEYXlzLFxuICAgIGRheXNJbldlZWtcbiAgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgY29uc3QgeyB2aWV3U3RhcnQsIHZpZXdFbmQgfSA9IGdldFdlZWtWaWV3UGVyaW9kKFxuICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgIGRhdGUsXG4gICAgICB3ZWVrU3RhcnRzT24sXG4gICAgICBleGNsdWRlRGF5cyxcbiAgICAgIGRheXNJbldlZWtcbiAgICApO1xuICAgIGNvbnN0IGZvcm1hdCA9IChkYXRlVG9Gb3JtYXQ6IERhdGUsIHNob3dZZWFyOiBib29sZWFuKSA9PlxuICAgICAgZm9ybWF0RGF0ZShkYXRlVG9Gb3JtYXQsICdNTU0gZCcgKyAoc2hvd1llYXIgPyAnLCB5eXl5JyA6ICcnKSwgbG9jYWxlKTtcbiAgICByZXR1cm4gYCR7Zm9ybWF0KFxuICAgICAgdmlld1N0YXJ0LFxuICAgICAgdmlld1N0YXJ0LmdldFVUQ0Z1bGxZZWFyKCkgIT09IHZpZXdFbmQuZ2V0VVRDRnVsbFllYXIoKVxuICAgICl9IC0gJHtmb3JtYXQodmlld0VuZCwgdHJ1ZSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdGltZSBmb3JtYXR0aW5nIGRvd24gdGhlIGxlZnQgaGFuZCBzaWRlIG9mIHRoZSB3ZWVrIHZpZXdcbiAgICovXG4gIHB1YmxpYyB3ZWVrVmlld0hvdXIoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGZvcm1hdERhdGUoZGF0ZSwgJ2ggYScsIGxvY2FsZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRpbWUgZm9ybWF0dGluZyBkb3duIHRoZSBsZWZ0IGhhbmQgc2lkZSBvZiB0aGUgZGF5IHZpZXdcbiAgICovXG4gIHB1YmxpYyBkYXlWaWV3SG91cih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZm9ybWF0RGF0ZShkYXRlLCAnaCBhJywgbG9jYWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGF5IHZpZXcgdGl0bGVcbiAgICovXG4gIHB1YmxpYyBkYXlWaWV3VGl0bGUoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGZvcm1hdERhdGUoZGF0ZSwgJ0VFRUUsIE1NTU0gZCwgeScsIGxvY2FsZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbGVuZGFyQW5ndWxhckRhdGVGb3JtYXR0ZXIgfSBmcm9tICcuL2NhbGVuZGFyLWFuZ3VsYXItZGF0ZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIGFsbCBmb3JtYXR0aW5nIG9mIGRhdGVzLiBUaGVyZSBhcmUgMyBpbXBsZW1lbnRhdGlvbnMgYXZhaWxhYmxlLCB0aGUgYENhbGVuZGFyQW5ndWxhckRhdGVGb3JtYXR0ZXJgIChkZWZhdWx0KSB3aGljaCB1c2VzIHRoZSBhbmd1bGFyIGRhdGUgcGlwZSB0byBmb3JtYXQgZGF0ZXMsIHRoZSBgQ2FsZW5kYXJOYXRpdmVEYXRlRm9ybWF0dGVyYCB3aGljaCB3aWxsIHVzZSB0aGUgPGEgaHJlZj1cImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0ludGxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5JbnRsPC9hPiBBUEkgdG8gZm9ybWF0IGRhdGVzLCBvciB0aGVyZSBpcyB0aGUgYENhbGVuZGFyTW9tZW50RGF0ZUZvcm1hdHRlcmAgd2hpY2ggdXNlcyA8YSBocmVmPVwiaHR0cDovL21vbWVudGpzLmNvbS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5tb21lbnQ8L2E+LlxuICpcbiAqIElmIHlvdSB3aXNoLCB5b3UgbWF5IG92ZXJyaWRlIGFueSBvZiB0aGUgZGVmYXVsdHMgdmlhIGFuZ3VsYXJzIERJLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBDYWxlbmRhckRhdGVGb3JtYXR0ZXIsIERhdGVGb3JtYXR0ZXJQYXJhbXMgfSBmcm9tICdhbmd1bGFyLWNhbGVuZGFyJztcbiAqIGltcG9ydCB7IGZvcm1hdERhdGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuICpcbiAqIGNsYXNzIEN1c3RvbURhdGVGb3JtYXR0ZXIgZXh0ZW5kcyBDYWxlbmRhckRhdGVGb3JtYXR0ZXIge1xuICpcbiAqICAgcHVibGljIG1vbnRoVmlld0NvbHVtbkhlYWRlcih7ZGF0ZSwgbG9jYWxlfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gKiAgICAgcmV0dXJuIGZvcm1hdERhdGUoZGF0ZSwgJ0VFRScsIGxvY2FsZSk7IC8vIHVzZSBzaG9ydCB3ZWVrIGRheXNcbiAqICAgfVxuICpcbiAqIH1cbiAqXG4gKiAvLyBpbiB5b3VyIGNvbXBvbmVudCB0aGF0IHVzZXMgdGhlIGNhbGVuZGFyXG4gKiBwcm92aWRlcnM6IFt7XG4gKiAgIHByb3ZpZGU6IENhbGVuZGFyRGF0ZUZvcm1hdHRlcixcbiAqICAgdXNlQ2xhc3M6IEN1c3RvbURhdGVGb3JtYXR0ZXJcbiAqIH1dXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyRGF0ZUZvcm1hdHRlciBleHRlbmRzIENhbGVuZGFyQW5ndWxhckRhdGVGb3JtYXR0ZXIge31cbiIsImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0sIExPQ0FMRV9JRCwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYWxlbmRhckRhdGVGb3JtYXR0ZXIgfSBmcm9tICcuL2NhbGVuZGFyLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyJztcblxuLyoqXG4gKiBUaGlzIHBpcGUgaXMgcHJpbWFyaWx5IGZvciByZW5kZXJpbmcgdGhlIGN1cnJlbnQgdmlldyB0aXRsZS4gRXhhbXBsZSB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIC8vIHdoZXJlIGB2aWV3RGF0ZWAgaXMgYSBgRGF0ZWAgYW5kIHZpZXcgaXMgYCdtb250aCcgfCAnd2VlaycgfCAnZGF5J2BcbiAqIHt7IHZpZXdEYXRlIHwgY2FsZW5kYXJEYXRlOih2aWV3ICsgJ1ZpZXdUaXRsZScpOidlbicgfX1cbiAqIGBgYFxuICovXG5AUGlwZSh7XG4gIG5hbWU6ICdjYWxlbmRhckRhdGUnXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyRGF0ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBkYXRlRm9ybWF0dGVyOiBDYWxlbmRhckRhdGVGb3JtYXR0ZXIsXG4gICAgQEluamVjdChMT0NBTEVfSUQpIHByaXZhdGUgbG9jYWxlOiBzdHJpbmdcbiAgKSB7fVxuXG4gIHRyYW5zZm9ybShcbiAgICBkYXRlOiBEYXRlLFxuICAgIG1ldGhvZDogc3RyaW5nLFxuICAgIGxvY2FsZTogc3RyaW5nID0gdGhpcy5sb2NhbGUsXG4gICAgd2Vla1N0YXJ0c09uOiBudW1iZXIgPSAwLFxuICAgIGV4Y2x1ZGVEYXlzOiBudW1iZXJbXSA9IFtdLFxuICAgIGRheXNJbldlZWs/OiBudW1iZXJcbiAgKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlRm9ybWF0dGVyW21ldGhvZF0oe1xuICAgICAgZGF0ZSxcbiAgICAgIGxvY2FsZSxcbiAgICAgIHdlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVEYXlzLFxuICAgICAgZGF5c0luV2Vla1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYWxlbmRhckV2ZW50IH0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIGRpc3BsYXlpbmcgYWxsIGV2ZW50IHRpdGxlcyB3aXRoaW4gdGhlIGNhbGVuZGFyLiBZb3UgbWF5IG92ZXJyaWRlIGFueSBvZiBpdHMgbWV0aG9kcyB2aWEgYW5ndWxhcnMgREkgdG8gc3VpdCB5b3VyIHJlcXVpcmVtZW50cy4gRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgQ2FsZW5kYXJFdmVudFRpdGxlRm9ybWF0dGVyLCBDYWxlbmRhckV2ZW50IH0gZnJvbSAnYW5ndWxhci1jYWxlbmRhcic7XG4gKlxuICogY2xhc3MgQ3VzdG9tRXZlbnRUaXRsZUZvcm1hdHRlciBleHRlbmRzIENhbGVuZGFyRXZlbnRUaXRsZUZvcm1hdHRlciB7XG4gKlxuICogICBtb250aChldmVudDogQ2FsZW5kYXJFdmVudCk6IHN0cmluZyB7XG4gKiAgICAgcmV0dXJuIGBDdXN0b20gcHJlZml4OiAke2V2ZW50LnRpdGxlfWA7XG4gKiAgIH1cbiAqXG4gKiB9XG4gKlxuICogLy8gaW4geW91ciBjb21wb25lbnRcbiAqIHByb3ZpZGVyczogW3tcbiAqICBwcm92aWRlOiBDYWxlbmRhckV2ZW50VGl0bGVGb3JtYXR0ZXIsXG4gKiAgdXNlQ2xhc3M6IEN1c3RvbUV2ZW50VGl0bGVGb3JtYXR0ZXJcbiAqIH1dXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIENhbGVuZGFyRXZlbnRUaXRsZUZvcm1hdHRlciB7XG4gIC8qKlxuICAgKiBUaGUgbW9udGggdmlldyBldmVudCB0aXRsZS5cbiAgICovXG4gIG1vbnRoKGV2ZW50OiBDYWxlbmRhckV2ZW50LCB0aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZXZlbnQudGl0bGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1vbnRoIHZpZXcgZXZlbnQgdG9vbHRpcC4gUmV0dXJuIGEgZmFsc2V5IHZhbHVlIGZyb20gdGhpcyB0byBkaXNhYmxlIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgbW9udGhUb29sdGlwKGV2ZW50OiBDYWxlbmRhckV2ZW50LCB0aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZXZlbnQudGl0bGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHdlZWsgdmlldyBldmVudCB0aXRsZS5cbiAgICovXG4gIHdlZWsoZXZlbnQ6IENhbGVuZGFyRXZlbnQsIHRpdGxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBldmVudC50aXRsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgd2VlayB2aWV3IGV2ZW50IHRvb2x0aXAuIFJldHVybiBhIGZhbHNleSB2YWx1ZSBmcm9tIHRoaXMgdG8gZGlzYWJsZSB0aGUgdG9vbHRpcC5cbiAgICovXG4gIHdlZWtUb29sdGlwKGV2ZW50OiBDYWxlbmRhckV2ZW50LCB0aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZXZlbnQudGl0bGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRheSB2aWV3IGV2ZW50IHRpdGxlLlxuICAgKi9cbiAgZGF5KGV2ZW50OiBDYWxlbmRhckV2ZW50LCB0aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZXZlbnQudGl0bGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRheSB2aWV3IGV2ZW50IHRvb2x0aXAuIFJldHVybiBhIGZhbHNleSB2YWx1ZSBmcm9tIHRoaXMgdG8gZGlzYWJsZSB0aGUgdG9vbHRpcC5cbiAgICovXG4gIGRheVRvb2x0aXAoZXZlbnQ6IENhbGVuZGFyRXZlbnQsIHRpdGxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBldmVudC50aXRsZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJFdmVudCB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnRUaXRsZUZvcm1hdHRlciB9IGZyb20gJy4vY2FsZW5kYXItZXZlbnQtdGl0bGUtZm9ybWF0dGVyLnByb3ZpZGVyJztcblxuQFBpcGUoe1xuICBuYW1lOiAnY2FsZW5kYXJFdmVudFRpdGxlJ1xufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckV2ZW50VGl0bGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2FsZW5kYXJFdmVudFRpdGxlOiBDYWxlbmRhckV2ZW50VGl0bGVGb3JtYXR0ZXIpIHt9XG5cbiAgdHJhbnNmb3JtKHRpdGxlOiBzdHJpbmcsIHRpdGxlVHlwZTogc3RyaW5nLCBldmVudDogQ2FsZW5kYXJFdmVudCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2FsZW5kYXJFdmVudFRpdGxlW3RpdGxlVHlwZV0oZXZlbnQsIHRpdGxlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWYsXG4gIE9uSW5pdCxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5jb25zdCBjbGlja0VsZW1lbnRzID0gbmV3IFNldDxIVE1MRWxlbWVudD4oKTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bENsaWNrXSdcbn0pXG5leHBvcnQgY2xhc3MgQ2xpY2tEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoJ213bENsaWNrJylcbiAgY2xpY2s6IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuXG4gIHByaXZhdGUgcmVtb3ZlTGlzdGVuZXI6ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZWxtOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50XG4gICkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBjbGlja0VsZW1lbnRzLmFkZCh0aGlzLmVsbS5uYXRpdmVFbGVtZW50KTtcbiAgICBjb25zdCBldmVudE5hbWU6IHN0cmluZyA9XG4gICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93WydIYW1tZXInXSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyAndGFwJ1xuICAgICAgICA6ICdjbGljayc7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lbG0ubmF0aXZlRWxlbWVudCxcbiAgICAgIGV2ZW50TmFtZSxcbiAgICAgIGV2ZW50ID0+IHtcbiAgICAgICAgLy8gcHJldmVudCBjaGlsZCBjbGljayBldmVudHMgZnJvbSBmaXJpbmcgb24gcGFyZW50IGVsZW1lbnRzIHRoYXQgYWxzbyBoYXZlIGNsaWNrIGV2ZW50c1xuICAgICAgICBsZXQgbmVhcmVzdENsaWNrYWJsZVBhcmVudDogSFRNTEVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIHdoaWxlIChcbiAgICAgICAgICAhY2xpY2tFbGVtZW50cy5oYXMobmVhcmVzdENsaWNrYWJsZVBhcmVudCkgJiZcbiAgICAgICAgICBuZWFyZXN0Q2xpY2thYmxlUGFyZW50ICE9PSB0aGlzLmRvY3VtZW50LmJvZHlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbmVhcmVzdENsaWNrYWJsZVBhcmVudCA9IG5lYXJlc3RDbGlja2FibGVQYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpc1RoaXNDbGlja2FibGVFbGVtZW50ID1cbiAgICAgICAgICB0aGlzLmVsbS5uYXRpdmVFbGVtZW50ID09PSBuZWFyZXN0Q2xpY2thYmxlUGFyZW50O1xuICAgICAgICBpZiAoaXNUaGlzQ2xpY2thYmxlRWxlbWVudCkge1xuICAgICAgICAgIHRoaXMuY2xpY2submV4dChldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigpO1xuICAgIGNsaWNrRWxlbWVudHMuZGVsZXRlKHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBHZXRNb250aFZpZXdBcmdzLFxuICBNb250aFZpZXcsXG4gIEdldFdlZWtWaWV3SGVhZGVyQXJncyxcbiAgV2Vla0RheSxcbiAgR2V0V2Vla1ZpZXdBcmdzLFxuICBHZXREYXlWaWV3QXJncyxcbiAgRGF5VmlldyxcbiAgR2V0RGF5Vmlld0hvdXJHcmlkQXJncyxcbiAgRGF5Vmlld0hvdXIsXG4gIFdlZWtWaWV3LFxuICBnZXREYXlWaWV3LFxuICBnZXREYXlWaWV3SG91ckdyaWQsXG4gIGdldE1vbnRoVmlldyxcbiAgZ2V0V2Vla1ZpZXdIZWFkZXIsXG4gIGdldFdlZWtWaWV3XG59IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmltcG9ydCB7IERhdGVBZGFwdGVyIH0gZnJvbSAnLi4vLi4vZGF0ZS1hZGFwdGVycy9kYXRlLWFkYXB0ZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJVdGlscyB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIpIHt9XG5cbiAgZ2V0TW9udGhWaWV3KGFyZ3M6IEdldE1vbnRoVmlld0FyZ3MpOiBNb250aFZpZXcge1xuICAgIHJldHVybiBnZXRNb250aFZpZXcodGhpcy5kYXRlQWRhcHRlciwgYXJncyk7XG4gIH1cblxuICBnZXRXZWVrVmlld0hlYWRlcihhcmdzOiBHZXRXZWVrVmlld0hlYWRlckFyZ3MpOiBXZWVrRGF5W10ge1xuICAgIHJldHVybiBnZXRXZWVrVmlld0hlYWRlcih0aGlzLmRhdGVBZGFwdGVyLCBhcmdzKTtcbiAgfVxuXG4gIGdldFdlZWtWaWV3KGFyZ3M6IEdldFdlZWtWaWV3QXJncyk6IFdlZWtWaWV3IHtcbiAgICByZXR1cm4gZ2V0V2Vla1ZpZXcodGhpcy5kYXRlQWRhcHRlciwgYXJncyk7XG4gIH1cblxuICBnZXREYXlWaWV3KGFyZ3M6IEdldERheVZpZXdBcmdzKTogRGF5VmlldyB7XG4gICAgcmV0dXJuIGdldERheVZpZXcodGhpcy5kYXRlQWRhcHRlciwgYXJncyk7XG4gIH1cblxuICBnZXREYXlWaWV3SG91ckdyaWQoYXJnczogR2V0RGF5Vmlld0hvdXJHcmlkQXJncyk6IERheVZpZXdIb3VyW10ge1xuICAgIHJldHVybiBnZXREYXlWaWV3SG91ckdyaWQodGhpcy5kYXRlQWRhcHRlciwgYXJncyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGlvblRva2VuLCBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbGVuZGFyRGF0ZUZvcm1hdHRlckludGVyZmFjZSxcbiAgRGF0ZUZvcm1hdHRlclBhcmFtc1xufSBmcm9tICcuL2NhbGVuZGFyLWRhdGUtZm9ybWF0dGVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBnZXRXZWVrVmlld1BlcmlvZCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcblxuZXhwb3J0IGNvbnN0IE1PTUVOVDogSW5qZWN0aW9uVG9rZW48c3RyaW5nPiA9IG5ldyBJbmplY3Rpb25Ub2tlbignTW9tZW50Jyk7XG5cbi8qKlxuICogVGhpcyB3aWxsIHVzZSA8YSBocmVmPVwiaHR0cDovL21vbWVudGpzLmNvbS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5tb21lbnQ8L2E+IHRvIGRvIGFsbCBkYXRlIGZvcm1hdHRpbmcuIFRvIHVzZSB0aGlzIGNsYXNzOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IENhbGVuZGFyRGF0ZUZvcm1hdHRlciwgQ2FsZW5kYXJNb21lbnREYXRlRm9ybWF0dGVyLCBNT01FTlQgfSBmcm9tICdhbmd1bGFyLWNhbGVuZGFyJztcbiAqIGltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbiAqXG4gKiAvLyBpbiB5b3VyIGNvbXBvbmVudFxuICogcHJvdmlkZTogW3tcbiAqICAgcHJvdmlkZTogTU9NRU5ULCB1c2VWYWx1ZTogbW9tZW50XG4gKiB9LCB7XG4gKiAgIHByb3ZpZGU6IENhbGVuZGFyRGF0ZUZvcm1hdHRlciwgdXNlQ2xhc3M6IENhbGVuZGFyTW9tZW50RGF0ZUZvcm1hdHRlclxuICogfV1cbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyTW9tZW50RGF0ZUZvcm1hdHRlclxuICBpbXBsZW1lbnRzIENhbGVuZGFyRGF0ZUZvcm1hdHRlckludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1PTUVOVCkgcHJvdGVjdGVkIG1vbWVudDogYW55LFxuICAgIHByb3RlY3RlZCBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXJcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBUaGUgbW9udGggdmlldyBoZWFkZXIgd2VlayBkYXkgbGFiZWxzXG4gICAqL1xuICBwdWJsaWMgbW9udGhWaWV3Q29sdW1uSGVhZGVyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1vbWVudChkYXRlKVxuICAgICAgLmxvY2FsZShsb2NhbGUpXG4gICAgICAuZm9ybWF0KCdkZGRkJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1vbnRoIHZpZXcgY2VsbCBkYXkgbnVtYmVyXG4gICAqL1xuICBwdWJsaWMgbW9udGhWaWV3RGF5TnVtYmVyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1vbWVudChkYXRlKVxuICAgICAgLmxvY2FsZShsb2NhbGUpXG4gICAgICAuZm9ybWF0KCdEJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1vbnRoIHZpZXcgdGl0bGVcbiAgICovXG4gIHB1YmxpYyBtb250aFZpZXdUaXRsZSh7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tb21lbnQoZGF0ZSlcbiAgICAgIC5sb2NhbGUobG9jYWxlKVxuICAgICAgLmZvcm1hdCgnTU1NTSBZWVlZJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHdlZWsgdmlldyBoZWFkZXIgd2VlayBkYXkgbGFiZWxzXG4gICAqL1xuICBwdWJsaWMgd2Vla1ZpZXdDb2x1bW5IZWFkZXIoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubW9tZW50KGRhdGUpXG4gICAgICAubG9jYWxlKGxvY2FsZSlcbiAgICAgIC5mb3JtYXQoJ2RkZGQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgd2VlayB2aWV3IHN1YiBoZWFkZXIgZGF5IGFuZCBtb250aCBsYWJlbHNcbiAgICovXG4gIHB1YmxpYyB3ZWVrVmlld0NvbHVtblN1YkhlYWRlcih7XG4gICAgZGF0ZSxcbiAgICBsb2NhbGVcbiAgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubW9tZW50KGRhdGUpXG4gICAgICAubG9jYWxlKGxvY2FsZSlcbiAgICAgIC5mb3JtYXQoJ01NTSBEJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHdlZWsgdmlldyB0aXRsZVxuICAgKi9cbiAgcHVibGljIHdlZWtWaWV3VGl0bGUoe1xuICAgIGRhdGUsXG4gICAgbG9jYWxlLFxuICAgIHdlZWtTdGFydHNPbixcbiAgICBleGNsdWRlRGF5cyxcbiAgICBkYXlzSW5XZWVrXG4gIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIGNvbnN0IHsgdmlld1N0YXJ0LCB2aWV3RW5kIH0gPSBnZXRXZWVrVmlld1BlcmlvZChcbiAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICBkYXRlLFxuICAgICAgd2Vla1N0YXJ0c09uLFxuICAgICAgZXhjbHVkZURheXMsXG4gICAgICBkYXlzSW5XZWVrXG4gICAgKTtcbiAgICBjb25zdCBmb3JtYXQgPSAoZGF0ZVRvRm9ybWF0OiBEYXRlLCBzaG93WWVhcjogYm9vbGVhbikgPT5cbiAgICAgIHRoaXMubW9tZW50KGRhdGVUb0Zvcm1hdClcbiAgICAgICAgLmxvY2FsZShsb2NhbGUpXG4gICAgICAgIC5mb3JtYXQoJ01NTSBEJyArIChzaG93WWVhciA/ICcsIFlZWVknIDogJycpKTtcbiAgICByZXR1cm4gYCR7Zm9ybWF0KFxuICAgICAgdmlld1N0YXJ0LFxuICAgICAgdmlld1N0YXJ0LmdldFVUQ0Z1bGxZZWFyKCkgIT09IHZpZXdFbmQuZ2V0VVRDRnVsbFllYXIoKVxuICAgICl9IC0gJHtmb3JtYXQodmlld0VuZCwgdHJ1ZSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdGltZSBmb3JtYXR0aW5nIGRvd24gdGhlIGxlZnQgaGFuZCBzaWRlIG9mIHRoZSB3ZWVrIHZpZXdcbiAgICovXG4gIHB1YmxpYyB3ZWVrVmlld0hvdXIoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubW9tZW50KGRhdGUpXG4gICAgICAubG9jYWxlKGxvY2FsZSlcbiAgICAgIC5mb3JtYXQoJ2hhJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRpbWUgZm9ybWF0dGluZyBkb3duIHRoZSBsZWZ0IGhhbmQgc2lkZSBvZiB0aGUgZGF5IHZpZXdcbiAgICovXG4gIHB1YmxpYyBkYXlWaWV3SG91cih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tb21lbnQoZGF0ZSlcbiAgICAgIC5sb2NhbGUobG9jYWxlKVxuICAgICAgLmZvcm1hdCgnaGEnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGF5IHZpZXcgdGl0bGVcbiAgICovXG4gIHB1YmxpYyBkYXlWaWV3VGl0bGUoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubW9tZW50KGRhdGUpXG4gICAgICAubG9jYWxlKGxvY2FsZSlcbiAgICAgIC5mb3JtYXQoJ2RkZGQsIEQgTU1NTSwgWVlZWScpO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBDYWxlbmRhckRhdGVGb3JtYXR0ZXJJbnRlcmZhY2UsXG4gIERhdGVGb3JtYXR0ZXJQYXJhbXNcbn0gZnJvbSAnLi9jYWxlbmRhci1kYXRlLWZvcm1hdHRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRlLWFkYXB0ZXJzL2RhdGUtYWRhcHRlcic7XG5pbXBvcnQgeyBnZXRXZWVrVmlld1BlcmlvZCB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogVGhpcyB3aWxsIHVzZSA8YSBocmVmPVwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvSW50bFwiIHRhcmdldD1cIl9ibGFua1wiPkludGw8L2E+IEFQSSB0byBkbyBhbGwgZGF0ZSBmb3JtYXR0aW5nLlxuICpcbiAqIFlvdSB3aWxsIG5lZWQgdG8gaW5jbHVkZSBhIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYW5keWVhcm5zaGF3L0ludGwuanMvXCI+cG9seWZpbGw8L2E+IGZvciBvbGRlciBicm93c2Vycy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyTmF0aXZlRGF0ZUZvcm1hdHRlclxuICBpbXBsZW1lbnRzIENhbGVuZGFyRGF0ZUZvcm1hdHRlckludGVyZmFjZSB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIpIHt9XG5cbiAgLyoqXG4gICAqIFRoZSBtb250aCB2aWV3IGhlYWRlciB3ZWVrIGRheSBsYWJlbHNcbiAgICovXG4gIHB1YmxpYyBtb250aFZpZXdDb2x1bW5IZWFkZXIoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwgeyB3ZWVrZGF5OiAnbG9uZycgfSkuZm9ybWF0KGRhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtb250aCB2aWV3IGNlbGwgZGF5IG51bWJlclxuICAgKi9cbiAgcHVibGljIG1vbnRoVmlld0RheU51bWJlcih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IGRheTogJ251bWVyaWMnIH0pLmZvcm1hdChkYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbW9udGggdmlldyB0aXRsZVxuICAgKi9cbiAgcHVibGljIG1vbnRoVmlld1RpdGxlKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHtcbiAgICAgIHllYXI6ICdudW1lcmljJyxcbiAgICAgIG1vbnRoOiAnbG9uZydcbiAgICB9KS5mb3JtYXQoZGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHdlZWsgdmlldyBoZWFkZXIgd2VlayBkYXkgbGFiZWxzXG4gICAqL1xuICBwdWJsaWMgd2Vla1ZpZXdDb2x1bW5IZWFkZXIoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwgeyB3ZWVrZGF5OiAnbG9uZycgfSkuZm9ybWF0KGRhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWVrIHZpZXcgc3ViIGhlYWRlciBkYXkgYW5kIG1vbnRoIGxhYmVsc1xuICAgKi9cbiAgcHVibGljIHdlZWtWaWV3Q29sdW1uU3ViSGVhZGVyKHtcbiAgICBkYXRlLFxuICAgIGxvY2FsZVxuICB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7XG4gICAgICBkYXk6ICdudW1lcmljJyxcbiAgICAgIG1vbnRoOiAnc2hvcnQnXG4gICAgfSkuZm9ybWF0KGRhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWVrIHZpZXcgdGl0bGVcbiAgICovXG4gIHB1YmxpYyB3ZWVrVmlld1RpdGxlKHtcbiAgICBkYXRlLFxuICAgIGxvY2FsZSxcbiAgICB3ZWVrU3RhcnRzT24sXG4gICAgZXhjbHVkZURheXMsXG4gICAgZGF5c0luV2Vla1xuICB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICBjb25zdCB7IHZpZXdTdGFydCwgdmlld0VuZCB9ID0gZ2V0V2Vla1ZpZXdQZXJpb2QoXG4gICAgICB0aGlzLmRhdGVBZGFwdGVyLFxuICAgICAgZGF0ZSxcbiAgICAgIHdlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVEYXlzLFxuICAgICAgZGF5c0luV2Vla1xuICAgICk7XG5cbiAgICBjb25zdCBmb3JtYXQgPSAoZGF0ZVRvRm9ybWF0OiBEYXRlLCBzaG93WWVhcjogYm9vbGVhbikgPT5cbiAgICAgIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwge1xuICAgICAgICBkYXk6ICdudW1lcmljJyxcbiAgICAgICAgbW9udGg6ICdzaG9ydCcsXG4gICAgICAgIHllYXI6IHNob3dZZWFyID8gJ251bWVyaWMnIDogdW5kZWZpbmVkXG4gICAgICB9KS5mb3JtYXQoZGF0ZVRvRm9ybWF0KTtcblxuICAgIHJldHVybiBgJHtmb3JtYXQoXG4gICAgICB2aWV3U3RhcnQsXG4gICAgICB2aWV3U3RhcnQuZ2V0VVRDRnVsbFllYXIoKSAhPT0gdmlld0VuZC5nZXRVVENGdWxsWWVhcigpXG4gICAgKX0gLSAke2Zvcm1hdCh2aWV3RW5kLCB0cnVlKX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIGZvcm1hdHRpbmcgZG93biB0aGUgbGVmdCBoYW5kIHNpZGUgb2YgdGhlIHdlZWsgdmlld1xuICAgKi9cbiAgcHVibGljIHdlZWtWaWV3SG91cih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IGhvdXI6ICdudW1lcmljJyB9KS5mb3JtYXQoZGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRpbWUgZm9ybWF0dGluZyBkb3duIHRoZSBsZWZ0IGhhbmQgc2lkZSBvZiB0aGUgZGF5IHZpZXdcbiAgICovXG4gIHB1YmxpYyBkYXlWaWV3SG91cih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IGhvdXI6ICdudW1lcmljJyB9KS5mb3JtYXQoZGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRheSB2aWV3IHRpdGxlXG4gICAqL1xuICBwdWJsaWMgZGF5Vmlld1RpdGxlKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHtcbiAgICAgIGRheTogJ251bWVyaWMnLFxuICAgICAgbW9udGg6ICdsb25nJyxcbiAgICAgIHllYXI6ICdudW1lcmljJyxcbiAgICAgIHdlZWtkYXk6ICdsb25nJ1xuICAgIH0pLmZvcm1hdChkYXRlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FsZW5kYXJFdmVudCB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcblxuZXhwb3J0IGVudW0gQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50VHlwZSB7XG4gIERyYWcgPSAnZHJhZycsXG4gIERyb3AgPSAnZHJvcCcsXG4gIFJlc2l6ZSA9ICdyZXNpemUnXG59XG5cbi8qKlxuICogVGhlIG91dHB1dCBgJGV2ZW50YCB0eXBlIHdoZW4gYW4gZXZlbnQgaXMgcmVzaXplZCBvciBkcmFnZ2VkIGFuZCBkcm9wcGVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudDxNZXRhVHlwZSA9IGFueT4ge1xuICB0eXBlOiBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlO1xuICBldmVudDogQ2FsZW5kYXJFdmVudDxNZXRhVHlwZT47XG4gIG5ld1N0YXJ0OiBEYXRlO1xuICBuZXdFbmQ/OiBEYXRlO1xuICBhbGxEYXk/OiBib29sZWFuO1xufVxuIiwiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ2FsZW5kYXJFdmVudEFjdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLWV2ZW50LWFjdGlvbnMuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnRUaXRsZUNvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItZXZlbnQtdGl0bGUuY29tcG9uZW50JztcbmltcG9ydCB7XG4gIENhbGVuZGFyVG9vbHRpcERpcmVjdGl2ZSxcbiAgQ2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50XG59IGZyb20gJy4vY2FsZW5kYXItdG9vbHRpcC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJQcmV2aW91c1ZpZXdEaXJlY3RpdmUgfSBmcm9tICcuL2NhbGVuZGFyLXByZXZpb3VzLXZpZXcuZGlyZWN0aXZlJztcbmltcG9ydCB7IENhbGVuZGFyTmV4dFZpZXdEaXJlY3RpdmUgfSBmcm9tICcuL2NhbGVuZGFyLW5leHQtdmlldy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJUb2RheURpcmVjdGl2ZSB9IGZyb20gJy4vY2FsZW5kYXItdG9kYXkuZGlyZWN0aXZlJztcbmltcG9ydCB7IENhbGVuZGFyRGF0ZVBpcGUgfSBmcm9tICcuL2NhbGVuZGFyLWRhdGUucGlwZSc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50VGl0bGVQaXBlIH0gZnJvbSAnLi9jYWxlbmRhci1ldmVudC10aXRsZS5waXBlJztcbmltcG9ydCB7IENsaWNrRGlyZWN0aXZlIH0gZnJvbSAnLi9jbGljay5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJFdmVudFRpdGxlRm9ybWF0dGVyIH0gZnJvbSAnLi9jYWxlbmRhci1ldmVudC10aXRsZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuaW1wb3J0IHsgQ2FsZW5kYXJEYXRlRm9ybWF0dGVyIH0gZnJvbSAnLi9jYWxlbmRhci1kYXRlLWZvcm1hdHRlci5wcm92aWRlcic7XG5pbXBvcnQgeyBDYWxlbmRhclV0aWxzIH0gZnJvbSAnLi9jYWxlbmRhci11dGlscy5wcm92aWRlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsZW5kYXJNb2R1bGVDb25maWcge1xuICBldmVudFRpdGxlRm9ybWF0dGVyPzogUHJvdmlkZXI7XG4gIGRhdGVGb3JtYXR0ZXI/OiBQcm92aWRlcjtcbiAgdXRpbHM/OiBQcm92aWRlcjtcbn1cblxuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci1ldmVudC10aXRsZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci1tb21lbnQtZGF0ZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci1uYXRpdmUtZGF0ZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci1hbmd1bGFyLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItZGF0ZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci11dGlscy5wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLWRhdGUtZm9ybWF0dGVyLmludGVyZmFjZSc7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLWV2ZW50LXRpbWVzLWNoYW5nZWQtZXZlbnQuaW50ZXJmYWNlJztcbmV4cG9ydCAqIGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItdmlldy5lbnVtJztcblxuZXhwb3J0IHtcbiAgQ2FsZW5kYXJFdmVudCxcbiAgRXZlbnRBY3Rpb24gYXMgQ2FsZW5kYXJFdmVudEFjdGlvbixcbiAgREFZU19PRl9XRUVLLFxuICBWaWV3UGVyaW9kIGFzIENhbGVuZGFyVmlld1BlcmlvZFxufSBmcm9tICdjYWxlbmRhci11dGlscyc7XG5cbi8qKlxuICogSW1wb3J0IHRoaXMgbW9kdWxlIHRvIGlmIHlvdSdyZSBqdXN0IHVzaW5nIGEgc2luZ3VsYXIgdmlldyBhbmQgd2FudCB0byBzYXZlIG9uIGJ1bmRsZSBzaXplLiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IENhbGVuZGFyQ29tbW9uTW9kdWxlLCBDYWxlbmRhck1vbnRoTW9kdWxlIH0gZnJvbSAnYW5ndWxhci1jYWxlbmRhcic7XG4gKlxuICogQE5nTW9kdWxlKHtcbiAqICAgaW1wb3J0czogW1xuICogICAgIENhbGVuZGFyQ29tbW9uTW9kdWxlLmZvclJvb3QoKSxcbiAqICAgICBDYWxlbmRhck1vbnRoTW9kdWxlXG4gKiAgIF1cbiAqIH0pXG4gKiBjbGFzcyBNeU1vZHVsZSB7fVxuICogYGBgXG4gKlxuICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBDYWxlbmRhckV2ZW50QWN0aW9uc0NvbXBvbmVudCxcbiAgICBDYWxlbmRhckV2ZW50VGl0bGVDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50LFxuICAgIENhbGVuZGFyVG9vbHRpcERpcmVjdGl2ZSxcbiAgICBDYWxlbmRhclByZXZpb3VzVmlld0RpcmVjdGl2ZSxcbiAgICBDYWxlbmRhck5leHRWaWV3RGlyZWN0aXZlLFxuICAgIENhbGVuZGFyVG9kYXlEaXJlY3RpdmUsXG4gICAgQ2FsZW5kYXJEYXRlUGlwZSxcbiAgICBDYWxlbmRhckV2ZW50VGl0bGVQaXBlLFxuICAgIENsaWNrRGlyZWN0aXZlXG4gIF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgQ2FsZW5kYXJFdmVudEFjdGlvbnNDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJFdmVudFRpdGxlQ29tcG9uZW50LFxuICAgIENhbGVuZGFyVG9vbHRpcFdpbmRvd0NvbXBvbmVudCxcbiAgICBDYWxlbmRhclRvb2x0aXBEaXJlY3RpdmUsXG4gICAgQ2FsZW5kYXJQcmV2aW91c1ZpZXdEaXJlY3RpdmUsXG4gICAgQ2FsZW5kYXJOZXh0Vmlld0RpcmVjdGl2ZSxcbiAgICBDYWxlbmRhclRvZGF5RGlyZWN0aXZlLFxuICAgIENhbGVuZGFyRGF0ZVBpcGUsXG4gICAgQ2FsZW5kYXJFdmVudFRpdGxlUGlwZSxcbiAgICBDbGlja0RpcmVjdGl2ZVxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtDYWxlbmRhclRvb2x0aXBXaW5kb3dDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyQ29tbW9uTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoXG4gICAgZGF0ZUFkYXB0ZXI6IFByb3ZpZGVyLFxuICAgIGNvbmZpZzogQ2FsZW5kYXJNb2R1bGVDb25maWcgPSB7fVxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IENhbGVuZGFyQ29tbW9uTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIGRhdGVBZGFwdGVyLFxuICAgICAgICBjb25maWcuZXZlbnRUaXRsZUZvcm1hdHRlciB8fCBDYWxlbmRhckV2ZW50VGl0bGVGb3JtYXR0ZXIsXG4gICAgICAgIGNvbmZpZy5kYXRlRm9ybWF0dGVyIHx8IENhbGVuZGFyRGF0ZUZvcm1hdHRlcixcbiAgICAgICAgY29uZmlnLnV0aWxzIHx8IENhbGVuZGFyVXRpbHNcbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25Jbml0LFxuICBPbkRlc3Ryb3ksXG4gIExPQ0FMRV9JRCxcbiAgSW5qZWN0LFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbGVuZGFyRXZlbnQsXG4gIFdlZWtEYXksXG4gIE1vbnRoVmlldyxcbiAgTW9udGhWaWV3RGF5LFxuICBWaWV3UGVyaW9kXG59IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50LFxuICBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlXG59IGZyb20gJy4uL2NvbW1vbi9jYWxlbmRhci1ldmVudC10aW1lcy1jaGFuZ2VkLWV2ZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBDYWxlbmRhclV0aWxzIH0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLXV0aWxzLnByb3ZpZGVyJztcbmltcG9ydCB7IHZhbGlkYXRlRXZlbnRzLCB0cmFja0J5SW5kZXggfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7IFBsYWNlbWVudEFycmF5IH0gZnJvbSAncG9zaXRpb25pbmcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENhbGVuZGFyTW9udGhWaWV3QmVmb3JlUmVuZGVyRXZlbnQge1xuICBoZWFkZXI6IFdlZWtEYXlbXTtcbiAgYm9keTogTW9udGhWaWV3RGF5W107XG4gIHBlcmlvZDogVmlld1BlcmlvZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDYWxlbmRhck1vbnRoVmlld0V2ZW50VGltZXNDaGFuZ2VkRXZlbnQ8XG4gIEV2ZW50TWV0YVR5cGUgPSBhbnksXG4gIERheU1ldGFUeXBlID0gYW55XG4+IGV4dGVuZHMgQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50PEV2ZW50TWV0YVR5cGU+IHtcbiAgZGF5OiBNb250aFZpZXdEYXk8RGF5TWV0YVR5cGU+O1xufVxuXG4vKipcbiAqIFNob3dzIGFsbCBldmVudHMgb24gYSBnaXZlbiBtb250aC4gRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiA8bXdsLWNhbGVuZGFyLW1vbnRoLXZpZXdcbiAqICBbdmlld0RhdGVdPVwidmlld0RhdGVcIlxuICogIFtldmVudHNdPVwiZXZlbnRzXCI+XG4gKiA8L213bC1jYWxlbmRhci1tb250aC12aWV3PlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ213bC1jYWxlbmRhci1tb250aC12aWV3JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiY2FsLW1vbnRoLXZpZXdcIj5cbiAgICAgIDxtd2wtY2FsZW5kYXItbW9udGgtdmlldy1oZWFkZXJcbiAgICAgICAgW2RheXNdPVwiY29sdW1uSGVhZGVyc1wiXG4gICAgICAgIFtsb2NhbGVdPVwibG9jYWxlXCJcbiAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImhlYWRlclRlbXBsYXRlXCI+XG4gICAgICA8L213bC1jYWxlbmRhci1tb250aC12aWV3LWhlYWRlcj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjYWwtZGF5c1wiPlxuICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCByb3dJbmRleCBvZiB2aWV3LnJvd09mZnNldHM7IHRyYWNrQnlJbmRleFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtY2VsbC1yb3dcIj5cbiAgICAgICAgICAgIDxtd2wtY2FsZW5kYXItbW9udGgtY2VsbFxuICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgZGF5IG9mICh2aWV3LmRheXMgfCBzbGljZSA6IHJvd0luZGV4IDogcm93SW5kZXggKyAodmlldy50b3RhbERheXNWaXNpYmxlSW5XZWVrKSk7IHRyYWNrQnk6dHJhY2tCeURhdGVcIlxuICAgICAgICAgICAgICBbbmdDbGFzc109XCJkYXk/LmNzc0NsYXNzXCJcbiAgICAgICAgICAgICAgW2RheV09XCJkYXlcIlxuICAgICAgICAgICAgICBbb3BlbkRheV09XCJvcGVuRGF5XCJcbiAgICAgICAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxuICAgICAgICAgICAgICBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBBcHBlbmRUb0JvZHldPVwidG9vbHRpcEFwcGVuZFRvQm9keVwiXG4gICAgICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImNlbGxUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIChtd2xDbGljayk9XCJkYXlDbGlja2VkLmVtaXQoeyBkYXk6IGRheSB9KVwiXG4gICAgICAgICAgICAgIChoaWdobGlnaHREYXkpPVwidG9nZ2xlRGF5SGlnaGxpZ2h0KCRldmVudC5ldmVudCwgdHJ1ZSlcIlxuICAgICAgICAgICAgICAodW5oaWdobGlnaHREYXkpPVwidG9nZ2xlRGF5SGlnaGxpZ2h0KCRldmVudC5ldmVudCwgZmFsc2UpXCJcbiAgICAgICAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgICAgICAgIGRyYWdPdmVyQ2xhc3M9XCJjYWwtZHJhZy1vdmVyXCJcbiAgICAgICAgICAgICAgKGRyb3ApPVwiZXZlbnREcm9wcGVkKGRheSwgJGV2ZW50LmRyb3BEYXRhLmV2ZW50LCAkZXZlbnQuZHJvcERhdGEuZHJhZ2dlZEZyb20pXCJcbiAgICAgICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6ICRldmVudC5ldmVudH0pXCI+XG4gICAgICAgICAgICA8L213bC1jYWxlbmRhci1tb250aC1jZWxsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxtd2wtY2FsZW5kYXItb3Blbi1kYXktZXZlbnRzXG4gICAgICAgICAgICBbaXNPcGVuXT1cIm9wZW5Sb3dJbmRleCA9PT0gcm93SW5kZXhcIlxuICAgICAgICAgICAgW2V2ZW50c109XCJvcGVuRGF5Py5ldmVudHNcIlxuICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cIm9wZW5EYXlFdmVudHNUZW1wbGF0ZVwiXG4gICAgICAgICAgICBbZXZlbnRUaXRsZVRlbXBsYXRlXT1cImV2ZW50VGl0bGVUZW1wbGF0ZVwiXG4gICAgICAgICAgICBbZXZlbnRBY3Rpb25zVGVtcGxhdGVdPVwiZXZlbnRBY3Rpb25zVGVtcGxhdGVcIlxuICAgICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6ICRldmVudC5ldmVudH0pXCJcbiAgICAgICAgICAgIG13bERyb3BwYWJsZVxuICAgICAgICAgICAgZHJhZ092ZXJDbGFzcz1cImNhbC1kcmFnLW92ZXJcIlxuICAgICAgICAgICAgKGRyb3ApPVwiZXZlbnREcm9wcGVkKG9wZW5EYXksICRldmVudC5kcm9wRGF0YS5ldmVudCwgJGV2ZW50LmRyb3BEYXRhLmRyYWdnZWRGcm9tKVwiPlxuICAgICAgICAgIDwvbXdsLWNhbGVuZGFyLW9wZW4tZGF5LWV2ZW50cz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhck1vbnRoVmlld0NvbXBvbmVudFxuICBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmlldyBkYXRlXG4gICAqL1xuICBASW5wdXQoKVxuICB2aWV3RGF0ZTogRGF0ZTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXZlbnRzIHRvIGRpc3BsYXkgb24gdmlldy5cbiAgICogVGhlIHNjaGVtYSBpcyBhdmFpbGFibGUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL21hdHRsZXdpczkyL2NhbGVuZGFyLXV0aWxzL2Jsb2IvYzUxNjg5OTg1ZjU5YTI3MTk0MGUzMGJjNGUyYzRlMWZlZTNmY2I1Yy9zcmMvY2FsZW5kYXJVdGlscy50cyNMNDktTDYzXG4gICAqL1xuICBASW5wdXQoKVxuICBldmVudHM6IENhbGVuZGFyRXZlbnRbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBkYXkgaW5kZXhlcyAoMCA9IHN1bmRheSwgMSA9IG1vbmRheSBldGMpIHRoYXQgd2lsbCBiZSBoaWRkZW4gb24gdGhlIHZpZXdcbiAgICovXG4gIEBJbnB1dCgpXG4gIGV4Y2x1ZGVEYXlzOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBldmVudHMgbGlzdCBmb3IgdGhlIGRheSBvZiB0aGUgYHZpZXdEYXRlYCBvcHRpb24gaXMgdmlzaWJsZSBvciBub3RcbiAgICovXG4gIEBJbnB1dCgpXG4gIGFjdGl2ZURheUlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBbiBvYnNlcnZhYmxlIHRoYXQgd2hlbiBlbWl0dGVkIG9uIHdpbGwgcmUtcmVuZGVyIHRoZSBjdXJyZW50IHZpZXdcbiAgICovXG4gIEBJbnB1dCgpXG4gIHJlZnJlc2g6IFN1YmplY3Q8YW55PjtcblxuICAvKipcbiAgICogVGhlIGxvY2FsZSB1c2VkIHRvIGZvcm1hdCBkYXRlc1xuICAgKi9cbiAgQElucHV0KClcbiAgbG9jYWxlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwbGFjZW1lbnQgb2YgdGhlIGV2ZW50IHRvb2x0aXBcbiAgICovXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBQbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5ID0gJ2F1dG8nO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIHRoZSBldmVudCB0b29sdGlwc1xuICAgKi9cbiAgQElucHV0KClcbiAgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGFwcGVuZCB0b29sdGlwcyB0byB0aGUgYm9keSBvciBuZXh0IHRvIHRoZSB0cmlnZ2VyIGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBBcHBlbmRUb0JvZHk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhcnQgbnVtYmVyIG9mIHRoZSB3ZWVrXG4gICAqL1xuICBASW5wdXQoKVxuICB3ZWVrU3RhcnRzT246IG51bWJlcjtcblxuICAvKipcbiAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIHRvIHJlcGxhY2UgdGhlIGhlYWRlclxuICAgKi9cbiAgQElucHV0KClcbiAgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBkYXkgY2VsbFxuICAgKi9cbiAgQElucHV0KClcbiAgY2VsbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIHRoZSBzbGlkZSBkb3duIGJveCBvZiBldmVudHMgZm9yIHRoZSBhY3RpdmUgZGF5XG4gICAqL1xuICBASW5wdXQoKVxuICBvcGVuRGF5RXZlbnRzVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgZXZlbnQgdGl0bGVzXG4gICAqL1xuICBASW5wdXQoKVxuICBldmVudFRpdGxlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgZXZlbnQgYWN0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgZXZlbnRBY3Rpb25zVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGRheSBpbmRleGVzICgwID0gc3VuZGF5LCAxID0gbW9uZGF5IGV0YykgdGhhdCBpbmRpY2F0ZSB3aGljaCBkYXlzIGFyZSB3ZWVrZW5kc1xuICAgKi9cbiAgQElucHV0KClcbiAgd2Vla2VuZERheXM6IG51bWJlcltdO1xuXG4gIC8qKlxuICAgKiBBbiBvdXRwdXQgdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHZpZXcgaXMgcmVuZGVyZWQgZm9yIHRoZSBjdXJyZW50IG1vbnRoLlxuICAgKiBJZiB5b3UgYWRkIHRoZSBgY3NzQ2xhc3NgIHByb3BlcnR5IHRvIGEgZGF5IGluIHRoZSBib2R5IGl0IHdpbGwgYWRkIHRoYXQgY2xhc3MgdG8gdGhlIGNlbGwgZWxlbWVudCBpbiB0aGUgdGVtcGxhdGVcbiAgICovXG4gIEBPdXRwdXQoKVxuICBiZWZvcmVWaWV3UmVuZGVyID0gbmV3IEV2ZW50RW1pdHRlcjxDYWxlbmRhck1vbnRoVmlld0JlZm9yZVJlbmRlckV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgZGF5IGNlbGwgaXMgY2xpY2tlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRheUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBkYXk6IE1vbnRoVmlld0RheTtcbiAgfT4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGV2ZW50IHRpdGxlIGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBldmVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBldmVudDogQ2FsZW5kYXJFdmVudDtcbiAgfT4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYW4gZXZlbnQgaXMgZHJhZ2dlZCBhbmQgZHJvcHBlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGV2ZW50VGltZXNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBDYWxlbmRhck1vbnRoVmlld0V2ZW50VGltZXNDaGFuZ2VkRXZlbnRcbiAgPigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBjb2x1bW5IZWFkZXJzOiBXZWVrRGF5W107XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHZpZXc6IE1vbnRoVmlldztcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgb3BlblJvd0luZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG9wZW5EYXk6IE1vbnRoVmlld0RheTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcmVmcmVzaFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5SW5kZXggPSB0cmFja0J5SW5kZXg7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRyYWNrQnlEYXRlID0gKGluZGV4OiBudW1iZXIsIGRheTogTW9udGhWaWV3RGF5KSA9PiBkYXkuZGF0ZS50b0lTT1N0cmluZygpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSB1dGlsczogQ2FsZW5kYXJVdGlscyxcbiAgICBASW5qZWN0KExPQ0FMRV9JRCkgbG9jYWxlOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXJcbiAgKSB7XG4gICAgdGhpcy5sb2NhbGUgPSBsb2NhbGU7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVmcmVzaCkge1xuICAgICAgdGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5yZWZyZXNoLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcmVzaEFsbCgpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy52aWV3RGF0ZSB8fCBjaGFuZ2VzLmV4Y2x1ZGVEYXlzIHx8IGNoYW5nZXMud2Vla2VuZERheXMpIHtcbiAgICAgIHRoaXMucmVmcmVzaEhlYWRlcigpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLmV2ZW50cykge1xuICAgICAgdmFsaWRhdGVFdmVudHModGhpcy5ldmVudHMpO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGNoYW5nZXMudmlld0RhdGUgfHxcbiAgICAgIGNoYW5nZXMuZXZlbnRzIHx8XG4gICAgICBjaGFuZ2VzLmV4Y2x1ZGVEYXlzIHx8XG4gICAgICBjaGFuZ2VzLndlZWtlbmREYXlzXG4gICAgKSB7XG4gICAgICB0aGlzLnJlZnJlc2hCb2R5KCk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgY2hhbmdlcy5hY3RpdmVEYXlJc09wZW4gfHxcbiAgICAgIGNoYW5nZXMudmlld0RhdGUgfHxcbiAgICAgIGNoYW5nZXMuZXZlbnRzIHx8XG4gICAgICBjaGFuZ2VzLmV4Y2x1ZGVEYXlzXG4gICAgKSB7XG4gICAgICB0aGlzLmNoZWNrQWN0aXZlRGF5SXNPcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucmVmcmVzaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0b2dnbGVEYXlIaWdobGlnaHQoZXZlbnQ6IENhbGVuZGFyRXZlbnQsIGlzSGlnaGxpZ2h0ZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnZpZXcuZGF5cy5mb3JFYWNoKGRheSA9PiB7XG4gICAgICBpZiAoaXNIaWdobGlnaHRlZCAmJiBkYXkuZXZlbnRzLmluZGV4T2YoZXZlbnQpID4gLTEpIHtcbiAgICAgICAgZGF5LmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgKGV2ZW50LmNvbG9yICYmIGV2ZW50LmNvbG9yLnNlY29uZGFyeSkgfHwgJyNEMUU4RkYnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGRheS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZXZlbnREcm9wcGVkKFxuICAgIGRyb3BwZWRPbjogTW9udGhWaWV3RGF5LFxuICAgIGV2ZW50OiBDYWxlbmRhckV2ZW50LFxuICAgIGRyYWdnZWRGcm9tPzogTW9udGhWaWV3RGF5XG4gICk6IHZvaWQge1xuICAgIGlmIChkcm9wcGVkT24gIT09IGRyYWdnZWRGcm9tKSB7XG4gICAgICBjb25zdCB5ZWFyOiBudW1iZXIgPSB0aGlzLmRhdGVBZGFwdGVyLmdldFllYXIoZHJvcHBlZE9uLmRhdGUpO1xuICAgICAgY29uc3QgbW9udGg6IG51bWJlciA9IHRoaXMuZGF0ZUFkYXB0ZXIuZ2V0TW9udGgoZHJvcHBlZE9uLmRhdGUpO1xuICAgICAgY29uc3QgZGF0ZTogbnVtYmVyID0gdGhpcy5kYXRlQWRhcHRlci5nZXREYXRlKGRyb3BwZWRPbi5kYXRlKTtcbiAgICAgIGNvbnN0IG5ld1N0YXJ0OiBEYXRlID0gdGhpcy5kYXRlQWRhcHRlci5zZXREYXRlKFxuICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLnNldE1vbnRoKFxuICAgICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIuc2V0WWVhcihldmVudC5zdGFydCwgeWVhciksXG4gICAgICAgICAgbW9udGhcbiAgICAgICAgKSxcbiAgICAgICAgZGF0ZVxuICAgICAgKTtcbiAgICAgIGxldCBuZXdFbmQ6IERhdGU7XG4gICAgICBpZiAoZXZlbnQuZW5kKSB7XG4gICAgICAgIGNvbnN0IHNlY29uZHNEaWZmOiBudW1iZXIgPSB0aGlzLmRhdGVBZGFwdGVyLmRpZmZlcmVuY2VJblNlY29uZHMoXG4gICAgICAgICAgbmV3U3RhcnQsXG4gICAgICAgICAgZXZlbnQuc3RhcnRcbiAgICAgICAgKTtcbiAgICAgICAgbmV3RW5kID0gdGhpcy5kYXRlQWRhcHRlci5hZGRTZWNvbmRzKGV2ZW50LmVuZCwgc2Vjb25kc0RpZmYpO1xuICAgICAgfVxuICAgICAgdGhpcy5ldmVudFRpbWVzQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIG5ld1N0YXJ0LFxuICAgICAgICBuZXdFbmQsXG4gICAgICAgIGRheTogZHJvcHBlZE9uLFxuICAgICAgICB0eXBlOiBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLkRyb3BcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaEhlYWRlcigpOiB2b2lkIHtcbiAgICB0aGlzLmNvbHVtbkhlYWRlcnMgPSB0aGlzLnV0aWxzLmdldFdlZWtWaWV3SGVhZGVyKHtcbiAgICAgIHZpZXdEYXRlOiB0aGlzLnZpZXdEYXRlLFxuICAgICAgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVkOiB0aGlzLmV4Y2x1ZGVEYXlzLFxuICAgICAgd2Vla2VuZERheXM6IHRoaXMud2Vla2VuZERheXNcbiAgICB9KTtcbiAgICB0aGlzLmVtaXRCZWZvcmVWaWV3UmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hCb2R5KCk6IHZvaWQge1xuICAgIHRoaXMudmlldyA9IHRoaXMudXRpbHMuZ2V0TW9udGhWaWV3KHtcbiAgICAgIGV2ZW50czogdGhpcy5ldmVudHMsXG4gICAgICB2aWV3RGF0ZTogdGhpcy52aWV3RGF0ZSxcbiAgICAgIHdlZWtTdGFydHNPbjogdGhpcy53ZWVrU3RhcnRzT24sXG4gICAgICBleGNsdWRlZDogdGhpcy5leGNsdWRlRGF5cyxcbiAgICAgIHdlZWtlbmREYXlzOiB0aGlzLndlZWtlbmREYXlzXG4gICAgfSk7XG4gICAgdGhpcy5lbWl0QmVmb3JlVmlld1JlbmRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0FjdGl2ZURheUlzT3BlbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hY3RpdmVEYXlJc09wZW4gPT09IHRydWUpIHtcbiAgICAgIHRoaXMub3BlbkRheSA9IHRoaXMudmlldy5kYXlzLmZpbmQoZGF5ID0+XG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIuaXNTYW1lRGF5KGRheS5kYXRlLCB0aGlzLnZpZXdEYXRlKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGluZGV4OiBudW1iZXIgPSB0aGlzLnZpZXcuZGF5cy5pbmRleE9mKHRoaXMub3BlbkRheSk7XG4gICAgICB0aGlzLm9wZW5Sb3dJbmRleCA9XG4gICAgICAgIE1hdGguZmxvb3IoaW5kZXggLyB0aGlzLnZpZXcudG90YWxEYXlzVmlzaWJsZUluV2VlaykgKlxuICAgICAgICB0aGlzLnZpZXcudG90YWxEYXlzVmlzaWJsZUluV2VlaztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuUm93SW5kZXggPSBudWxsO1xuICAgICAgdGhpcy5vcGVuRGF5ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5jb2x1bW5IZWFkZXJzID0gbnVsbDtcbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIHRoaXMucmVmcmVzaEhlYWRlcigpO1xuICAgIHRoaXMucmVmcmVzaEJvZHkoKTtcbiAgICB0aGlzLmNoZWNrQWN0aXZlRGF5SXNPcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRCZWZvcmVWaWV3UmVuZGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbHVtbkhlYWRlcnMgJiYgdGhpcy52aWV3KSB7XG4gICAgICB0aGlzLmJlZm9yZVZpZXdSZW5kZXIuZW1pdCh7XG4gICAgICAgIGhlYWRlcjogdGhpcy5jb2x1bW5IZWFkZXJzLFxuICAgICAgICBib2R5OiB0aGlzLnZpZXcuZGF5cyxcbiAgICAgICAgcGVyaW9kOiB0aGlzLnZpZXcucGVyaW9kXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBXZWVrRGF5IH0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItbW9udGgtdmlldy1oZWFkZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWRheXM9XCJkYXlzXCJcbiAgICAgIGxldC1sb2NhbGU9XCJsb2NhbGVcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjYWwtY2VsbC1yb3cgY2FsLWhlYWRlclwiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3M9XCJjYWwtY2VsbFwiXG4gICAgICAgICAgKm5nRm9yPVwibGV0IGRheSBvZiBkYXlzOyB0cmFja0J5OnRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZVwiXG4gICAgICAgICAgW2NsYXNzLmNhbC1wYXN0XT1cImRheS5pc1Bhc3RcIlxuICAgICAgICAgIFtjbGFzcy5jYWwtdG9kYXldPVwiZGF5LmlzVG9kYXlcIlxuICAgICAgICAgIFtjbGFzcy5jYWwtZnV0dXJlXT1cImRheS5pc0Z1dHVyZVwiXG4gICAgICAgICAgW2NsYXNzLmNhbC13ZWVrZW5kXT1cImRheS5pc1dlZWtlbmRcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cImRheS5jc3NDbGFzc1wiPlxuICAgICAgICAgIHt7IGRheS5kYXRlIHwgY2FsZW5kYXJEYXRlOidtb250aFZpZXdDb2x1bW5IZWFkZXInOmxvY2FsZSB9fVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntkYXlzOiBkYXlzLCBsb2NhbGU6IGxvY2FsZX1cIj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyTW9udGhWaWV3SGVhZGVyQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgZGF5czogV2Vla0RheVtdO1xuXG4gIEBJbnB1dCgpXG4gIGxvY2FsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZSA9IHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZTtcbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1vbnRoVmlld0RheSwgQ2FsZW5kYXJFdmVudCB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmltcG9ydCB7IHRyYWNrQnlFdmVudElkIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHsgUGxhY2VtZW50QXJyYXkgfSBmcm9tICdwb3NpdGlvbmluZyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ213bC1jYWxlbmRhci1tb250aC1jZWxsJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICNkZWZhdWx0VGVtcGxhdGVcbiAgICAgIGxldC1kYXk9XCJkYXlcIlxuICAgICAgbGV0LW9wZW5EYXk9XCJvcGVuRGF5XCJcbiAgICAgIGxldC1sb2NhbGU9XCJsb2NhbGVcIlxuICAgICAgbGV0LXRvb2x0aXBQbGFjZW1lbnQ9XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgIGxldC1oaWdobGlnaHREYXk9XCJoaWdobGlnaHREYXlcIlxuICAgICAgbGV0LXVuaGlnaGxpZ2h0RGF5PVwidW5oaWdobGlnaHREYXlcIlxuICAgICAgbGV0LWV2ZW50Q2xpY2tlZD1cImV2ZW50Q2xpY2tlZFwiXG4gICAgICBsZXQtdG9vbHRpcFRlbXBsYXRlPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgIGxldC10b29sdGlwQXBwZW5kVG9Cb2R5PVwidG9vbHRpcEFwcGVuZFRvQm9keVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNhbC1jZWxsLXRvcFwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNhbC1kYXktYmFkZ2VcIiAqbmdJZj1cImRheS5iYWRnZVRvdGFsID4gMFwiPnt7IGRheS5iYWRnZVRvdGFsIH19PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNhbC1kYXktbnVtYmVyXCI+e3sgZGF5LmRhdGUgfCBjYWxlbmRhckRhdGU6J21vbnRoVmlld0RheU51bWJlcic6bG9jYWxlIH19PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2FsLWV2ZW50c1wiICpuZ0lmPVwiZGF5LmV2ZW50cy5sZW5ndGggPiAwXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudFwiXG4gICAgICAgICAgKm5nRm9yPVwibGV0IGV2ZW50IG9mIGRheS5ldmVudHM7IHRyYWNrQnk6dHJhY2tCeUV2ZW50SWRcIlxuICAgICAgICAgIFtzdHlsZS5iYWNrZ3JvdW5kQ29sb3JdPVwiZXZlbnQuY29sb3I/LnByaW1hcnlcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cImV2ZW50Py5jc3NDbGFzc1wiXG4gICAgICAgICAgKG1vdXNlZW50ZXIpPVwiaGlnaGxpZ2h0RGF5LmVtaXQoe2V2ZW50OiBldmVudH0pXCJcbiAgICAgICAgICAobW91c2VsZWF2ZSk9XCJ1bmhpZ2hsaWdodERheS5lbWl0KHtldmVudDogZXZlbnR9KVwiXG4gICAgICAgICAgW213bENhbGVuZGFyVG9vbHRpcF09XCJldmVudC50aXRsZSB8IGNhbGVuZGFyRXZlbnRUaXRsZTonbW9udGhUb29sdGlwJzpldmVudFwiXG4gICAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXG4gICAgICAgICAgW3Rvb2x0aXBFdmVudF09XCJldmVudFwiXG4gICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgICAgIFt0b29sdGlwQXBwZW5kVG9Cb2R5XT1cInRvb2x0aXBBcHBlbmRUb0JvZHlcIlxuICAgICAgICAgIG13bERyYWdnYWJsZVxuICAgICAgICAgIFtjbGFzcy5jYWwtZHJhZ2dhYmxlXT1cImV2ZW50LmRyYWdnYWJsZVwiXG4gICAgICAgICAgZHJhZ0FjdGl2ZUNsYXNzPVwiY2FsLWRyYWctYWN0aXZlXCJcbiAgICAgICAgICBbZHJvcERhdGFdPVwie2V2ZW50OiBldmVudCwgZHJhZ2dlZEZyb206IGRheX1cIlxuICAgICAgICAgIFtkcmFnQXhpc109XCJ7eDogZXZlbnQuZHJhZ2dhYmxlLCB5OiBldmVudC5kcmFnZ2FibGV9XCJcbiAgICAgICAgICAobXdsQ2xpY2spPVwiZXZlbnRDbGlja2VkLmVtaXQoeyBldmVudDogZXZlbnQgfSlcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgIGRheTogZGF5LFxuICAgICAgICBvcGVuRGF5OiBvcGVuRGF5LFxuICAgICAgICBsb2NhbGU6IGxvY2FsZSxcbiAgICAgICAgdG9vbHRpcFBsYWNlbWVudDogdG9vbHRpcFBsYWNlbWVudCxcbiAgICAgICAgaGlnaGxpZ2h0RGF5OiBoaWdobGlnaHREYXksXG4gICAgICAgIHVuaGlnaGxpZ2h0RGF5OiB1bmhpZ2hsaWdodERheSxcbiAgICAgICAgZXZlbnRDbGlja2VkOiBldmVudENsaWNrZWQsXG4gICAgICAgIHRvb2x0aXBUZW1wbGF0ZTogdG9vbHRpcFRlbXBsYXRlLFxuICAgICAgICB0b29sdGlwQXBwZW5kVG9Cb2R5OiB0b29sdGlwQXBwZW5kVG9Cb2R5XG4gICAgICB9XCI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnY2FsLWNlbGwgY2FsLWRheS1jZWxsJyxcbiAgICAnW2NsYXNzLmNhbC1wYXN0XSc6ICdkYXkuaXNQYXN0JyxcbiAgICAnW2NsYXNzLmNhbC10b2RheV0nOiAnZGF5LmlzVG9kYXknLFxuICAgICdbY2xhc3MuY2FsLWZ1dHVyZV0nOiAnZGF5LmlzRnV0dXJlJyxcbiAgICAnW2NsYXNzLmNhbC13ZWVrZW5kXSc6ICdkYXkuaXNXZWVrZW5kJyxcbiAgICAnW2NsYXNzLmNhbC1pbi1tb250aF0nOiAnZGF5LmluTW9udGgnLFxuICAgICdbY2xhc3MuY2FsLW91dC1tb250aF0nOiAnIWRheS5pbk1vbnRoJyxcbiAgICAnW2NsYXNzLmNhbC1oYXMtZXZlbnRzXSc6ICdkYXkuZXZlbnRzLmxlbmd0aCA+IDAnLFxuICAgICdbY2xhc3MuY2FsLW9wZW5dJzogJ2RheSA9PT0gb3BlbkRheScsXG4gICAgJ1tjbGFzcy5jYWwtZXZlbnQtaGlnaGxpZ2h0XSc6ICchIWRheS5iYWNrZ3JvdW5kQ29sb3InLFxuICAgICdbc3R5bGUuYmFja2dyb3VuZENvbG9yXSc6ICdkYXkuYmFja2dyb3VuZENvbG9yJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyTW9udGhDZWxsQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgZGF5OiBNb250aFZpZXdEYXk7XG5cbiAgQElucHV0KClcbiAgb3BlbkRheTogTW9udGhWaWV3RGF5O1xuXG4gIEBJbnB1dCgpXG4gIGxvY2FsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBQbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBBcHBlbmRUb0JvZHk6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBPdXRwdXQoKVxuICBoaWdobGlnaHREYXk6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBPdXRwdXQoKVxuICB1bmhpZ2hsaWdodERheTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQE91dHB1dCgpXG4gIGV2ZW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IENhbGVuZGFyRXZlbnQgfT4gPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBldmVudDogQ2FsZW5kYXJFdmVudDtcbiAgfT4oKTtcblxuICB0cmFja0J5RXZlbnRJZCA9IHRyYWNrQnlFdmVudElkO1xufVxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgdHJpZ2dlcixcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIGFuaW1hdGUsXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YVxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnQgfSBmcm9tICdjYWxlbmRhci11dGlscyc7XG5pbXBvcnQgeyB0cmFja0J5RXZlbnRJZCB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcblxuZXhwb3J0IGNvbnN0IGNvbGxhcHNlQW5pbWF0aW9uOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEgPSB0cmlnZ2VyKCdjb2xsYXBzZScsIFtcbiAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgW1xuICAgIHN0eWxlKHsgaGVpZ2h0OiAwLCBvdmVyZmxvdzogJ2hpZGRlbicgfSksXG4gICAgYW5pbWF0ZSgnMTUwbXMnLCBzdHlsZSh7IGhlaWdodDogJyonIH0pKVxuICBdKSxcbiAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgW1xuICAgIHN0eWxlKHsgaGVpZ2h0OiAnKicsIG92ZXJmbG93OiAnaGlkZGVuJyB9KSxcbiAgICBhbmltYXRlKCcxNTBtcycsIHN0eWxlKHsgaGVpZ2h0OiAwIH0pKVxuICBdKVxuXSk7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ213bC1jYWxlbmRhci1vcGVuLWRheS1ldmVudHMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWV2ZW50cz1cImV2ZW50c1wiXG4gICAgICBsZXQtZXZlbnRDbGlja2VkPVwiZXZlbnRDbGlja2VkXCJcbiAgICAgIGxldC1pc09wZW49XCJpc09wZW5cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjYWwtb3Blbi1kYXktZXZlbnRzXCIgW0Bjb2xsYXBzZV0gKm5nSWY9XCJpc09wZW5cIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgICpuZ0Zvcj1cImxldCBldmVudCBvZiBldmVudHM7IHRyYWNrQnk6dHJhY2tCeUV2ZW50SWRcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cImV2ZW50Py5jc3NDbGFzc1wiXG4gICAgICAgICAgbXdsRHJhZ2dhYmxlXG4gICAgICAgICAgW2NsYXNzLmNhbC1kcmFnZ2FibGVdPVwiZXZlbnQuZHJhZ2dhYmxlXCJcbiAgICAgICAgICBkcmFnQWN0aXZlQ2xhc3M9XCJjYWwtZHJhZy1hY3RpdmVcIlxuICAgICAgICAgIFtkcm9wRGF0YV09XCJ7ZXZlbnQ6IGV2ZW50fVwiXG4gICAgICAgICAgW2RyYWdBeGlzXT1cInt4OiBldmVudC5kcmFnZ2FibGUsIHk6IGV2ZW50LmRyYWdnYWJsZX1cIj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtZXZlbnRcIlxuICAgICAgICAgICAgW3N0eWxlLmJhY2tncm91bmRDb2xvcl09XCJldmVudC5jb2xvcj8ucHJpbWFyeVwiPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAmbmdzcDtcbiAgICAgICAgICA8bXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlXG4gICAgICAgICAgICBbZXZlbnRdPVwiZXZlbnRcIlxuICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImV2ZW50VGl0bGVUZW1wbGF0ZVwiXG4gICAgICAgICAgICB2aWV3PVwibW9udGhcIlxuICAgICAgICAgICAgKG13bENsaWNrKT1cImV2ZW50Q2xpY2tlZC5lbWl0KHtldmVudDogZXZlbnR9KVwiPlxuICAgICAgICAgIDwvbXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlPlxuICAgICAgICAgICZuZ3NwO1xuICAgICAgICAgIDxtd2wtY2FsZW5kYXItZXZlbnQtYWN0aW9uc1xuICAgICAgICAgICAgW2V2ZW50XT1cImV2ZW50XCJcbiAgICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJldmVudEFjdGlvbnNUZW1wbGF0ZVwiPlxuICAgICAgICAgIDwvbXdsLWNhbGVuZGFyLWV2ZW50LWFjdGlvbnM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICBldmVudHM6IGV2ZW50cyxcbiAgICAgICAgZXZlbnRDbGlja2VkOiBldmVudENsaWNrZWQsXG4gICAgICAgIGlzT3BlbjogaXNPcGVuXG4gICAgICB9XCI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgYW5pbWF0aW9uczogW2NvbGxhcHNlQW5pbWF0aW9uXVxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhck9wZW5EYXlFdmVudHNDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBpc09wZW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBldmVudHM6IENhbGVuZGFyRXZlbnRbXTtcblxuICBASW5wdXQoKVxuICBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKVxuICBldmVudFRpdGxlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KClcbiAgZXZlbnRBY3Rpb25zVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQE91dHB1dCgpXG4gIGV2ZW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IENhbGVuZGFyRXZlbnQgfT4gPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBldmVudDogQ2FsZW5kYXJFdmVudDtcbiAgfT4oKTtcblxuICB0cmFja0J5RXZlbnRJZCA9IHRyYWNrQnlFdmVudElkO1xufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEcmFnQW5kRHJvcE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZSc7XG5pbXBvcnQgeyBDYWxlbmRhck1vbnRoVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItbW9udGgtdmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FsZW5kYXJNb250aFZpZXdIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLW1vbnRoLXZpZXctaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhck1vbnRoQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItbW9udGgtY2VsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FsZW5kYXJPcGVuRGF5RXZlbnRzQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1vcGVuLWRheS1ldmVudHMuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyQ29tbW9uTW9kdWxlIH0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLWNvbW1vbi5tb2R1bGUnO1xuXG5leHBvcnQge1xuICBDYWxlbmRhck1vbnRoVmlld0NvbXBvbmVudCxcbiAgQ2FsZW5kYXJNb250aFZpZXdCZWZvcmVSZW5kZXJFdmVudCxcbiAgQ2FsZW5kYXJNb250aFZpZXdFdmVudFRpbWVzQ2hhbmdlZEV2ZW50XG59IGZyb20gJy4vY2FsZW5kYXItbW9udGgtdmlldy5jb21wb25lbnQnO1xuZXhwb3J0IHsgTW9udGhWaWV3RGF5IGFzIENhbGVuZGFyTW9udGhWaWV3RGF5IH0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuZXhwb3J0IHsgY29sbGFwc2VBbmltYXRpb24gfSBmcm9tICcuL2NhbGVuZGFyLW9wZW4tZGF5LWV2ZW50cy5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBEcmFnQW5kRHJvcE1vZHVsZSwgQ2FsZW5kYXJDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBDYWxlbmRhck1vbnRoVmlld0NvbXBvbmVudCxcbiAgICBDYWxlbmRhck1vbnRoQ2VsbENvbXBvbmVudCxcbiAgICBDYWxlbmRhck9wZW5EYXlFdmVudHNDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJNb250aFZpZXdIZWFkZXJDb21wb25lbnRcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIERyYWdBbmREcm9wTW9kdWxlLFxuICAgIENhbGVuZGFyTW9udGhWaWV3Q29tcG9uZW50LFxuICAgIENhbGVuZGFyTW9udGhDZWxsQ29tcG9uZW50LFxuICAgIENhbGVuZGFyT3BlbkRheUV2ZW50c0NvbXBvbmVudCxcbiAgICBDYWxlbmRhck1vbnRoVmlld0hlYWRlckNvbXBvbmVudFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyTW9udGhNb2R1bGUge31cbiIsImltcG9ydCB7IGlzSW5zaWRlIH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgRFJBR19USFJFU0hPTEQgPSAxO1xuXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJEcmFnSGVscGVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBzdGFydFBvc2l0aW9uOiBDbGllbnRSZWN0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZHJhZ0NvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIGRyYWdnYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50XG4gICkge1xuICAgIHRoaXMuc3RhcnRQb3NpdGlvbiA9IGRyYWdnYWJsZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIH1cblxuICB2YWxpZGF0ZURyYWcoe1xuICAgIHgsXG4gICAgeSxcbiAgICBzbmFwRHJhZ2dlZEV2ZW50c1xuICB9OiB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBzbmFwRHJhZ2dlZEV2ZW50czogYm9vbGVhbjtcbiAgfSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGlzV2l0aGluVGhyZXNob2xkID1cbiAgICAgIE1hdGguYWJzKHgpID4gRFJBR19USFJFU0hPTEQgfHwgTWF0aC5hYnMoeSkgPiBEUkFHX1RIUkVTSE9MRDtcblxuICAgIGlmIChzbmFwRHJhZ2dlZEV2ZW50cykge1xuICAgICAgY29uc3QgbmV3UmVjdDogQ2xpZW50UmVjdCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhcnRQb3NpdGlvbiwge1xuICAgICAgICBsZWZ0OiB0aGlzLnN0YXJ0UG9zaXRpb24ubGVmdCArIHgsXG4gICAgICAgIHJpZ2h0OiB0aGlzLnN0YXJ0UG9zaXRpb24ucmlnaHQgKyB4LFxuICAgICAgICB0b3A6IHRoaXMuc3RhcnRQb3NpdGlvbi50b3AgKyB5LFxuICAgICAgICBib3R0b206IHRoaXMuc3RhcnRQb3NpdGlvbi5ib3R0b20gKyB5XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgaXNXaXRoaW5UaHJlc2hvbGQgJiZcbiAgICAgICAgaXNJbnNpZGUodGhpcy5kcmFnQ29udGFpbmVyRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbmV3UmVjdClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc1dpdGhpblRocmVzaG9sZDtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IGlzSW5zaWRlIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGNsYXNzIENhbGVuZGFyUmVzaXplSGVscGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZXNpemVDb250YWluZXJFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBwcml2YXRlIG1pbldpZHRoPzogbnVtYmVyXG4gICkge31cblxuICB2YWxpZGF0ZVJlc2l6ZSh7IHJlY3RhbmdsZSB9OiB7IHJlY3RhbmdsZTogQ2xpZW50UmVjdCB9KTogYm9vbGVhbiB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5taW5XaWR0aCAmJlxuICAgICAgTWF0aC5jZWlsKHJlY3RhbmdsZS53aWR0aCkgPCBNYXRoLmNlaWwodGhpcy5taW5XaWR0aClcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXNJbnNpZGUoXG4gICAgICB0aGlzLnJlc2l6ZUNvbnRhaW5lckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICByZWN0YW5nbGVcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPbkRlc3Ryb3ksXG4gIExPQ0FMRV9JRCxcbiAgSW5qZWN0LFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgV2Vla0RheSxcbiAgQ2FsZW5kYXJFdmVudCxcbiAgV2Vla1ZpZXdBbGxEYXlFdmVudCxcbiAgV2Vla1ZpZXcsXG4gIFZpZXdQZXJpb2QsXG4gIFdlZWtWaWV3SG91ckNvbHVtbixcbiAgRGF5Vmlld0V2ZW50LFxuICBEYXlWaWV3SG91clNlZ21lbnQsXG4gIERheVZpZXdIb3VyXG59IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmltcG9ydCB7IFJlc2l6ZUV2ZW50IH0gZnJvbSAnYW5ndWxhci1yZXNpemFibGUtZWxlbWVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckRyYWdIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItZHJhZy1oZWxwZXIucHJvdmlkZXInO1xuaW1wb3J0IHsgQ2FsZW5kYXJSZXNpemVIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItcmVzaXplLWhlbHBlci5wcm92aWRlcic7XG5pbXBvcnQge1xuICBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnQsXG4gIENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFR5cGVcbn0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLWV2ZW50LXRpbWVzLWNoYW5nZWQtZXZlbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IENhbGVuZGFyVXRpbHMgfSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItdXRpbHMucHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgdmFsaWRhdGVFdmVudHMsXG4gIHRyYWNrQnlJbmRleCxcbiAgcm91bmRUb05lYXJlc3QsXG4gIHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZSxcbiAgdHJhY2tCeUhvdXJTZWdtZW50LFxuICB0cmFja0J5SG91cixcbiAgZ2V0TWludXRlc01vdmVkLFxuICBnZXREZWZhdWx0RXZlbnRFbmQsXG4gIGdldE1pbmltdW1FdmVudEhlaWdodEluTWludXRlcyxcbiAgYWRkRGF5c1dpdGhFeGNsdXNpb25zLFxuICB0cmFja0J5RGF5T3JXZWVrRXZlbnQsXG4gIGlzRHJhZ2dlZFdpdGhpblBlcmlvZCxcbiAgc2hvdWxkRmlyZURyb3BwZWRFdmVudCxcbiAgZ2V0V2Vla1ZpZXdQZXJpb2Rcbn0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRlLWFkYXB0ZXJzL2RhdGUtYWRhcHRlcic7XG5pbXBvcnQge1xuICBEcmFnRW5kRXZlbnQsXG4gIERyb3BFdmVudCxcbiAgRHJhZ01vdmVFdmVudFxufSBmcm9tICdhbmd1bGFyLWRyYWdnYWJsZS1kcm9wcGFibGUnO1xuaW1wb3J0IHsgUGxhY2VtZW50QXJyYXkgfSBmcm9tICdwb3NpdGlvbmluZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2Vla1ZpZXdBbGxEYXlFdmVudFJlc2l6ZSB7XG4gIG9yaWdpbmFsT2Zmc2V0OiBudW1iZXI7XG4gIG9yaWdpbmFsU3BhbjogbnVtYmVyO1xuICBlZGdlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsZW5kYXJXZWVrVmlld0JlZm9yZVJlbmRlckV2ZW50IGV4dGVuZHMgV2Vla1ZpZXcge1xuICBoZWFkZXI6IFdlZWtEYXlbXTtcbn1cblxuLyoqXG4gKiBTaG93cyBhbGwgZXZlbnRzIG9uIGEgZ2l2ZW4gd2Vlay4gRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiA8bXdsLWNhbGVuZGFyLXdlZWstdmlld1xuICogIFt2aWV3RGF0ZV09XCJ2aWV3RGF0ZVwiXG4gKiAgW2V2ZW50c109XCJldmVudHNcIj5cbiAqIDwvbXdsLWNhbGVuZGFyLXdlZWstdmlldz5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItd2Vlay12aWV3JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiY2FsLXdlZWstdmlld1wiPlxuICAgICAgPG13bC1jYWxlbmRhci13ZWVrLXZpZXctaGVhZGVyXG4gICAgICAgIFtkYXlzXT1cImRheXNcIlxuICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJoZWFkZXJUZW1wbGF0ZVwiXG4gICAgICAgIChkYXlIZWFkZXJDbGlja2VkKT1cImRheUhlYWRlckNsaWNrZWQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgKGV2ZW50RHJvcHBlZCk9XCJldmVudERyb3BwZWQoe2Ryb3BEYXRhOiAkZXZlbnR9LCAkZXZlbnQubmV3U3RhcnQsIHRydWUpXCI+XG4gICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctaGVhZGVyPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImNhbC1hbGwtZGF5LWV2ZW50c1wiXG4gICAgICAgICNhbGxEYXlFdmVudHNDb250YWluZXJcbiAgICAgICAgKm5nSWY9XCJ2aWV3LmFsbERheUV2ZW50Um93cy5sZW5ndGggPiAwXCJcbiAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgIChkcmFnRW50ZXIpPVwiZXZlbnREcmFnRW50ZXIgPSBldmVudERyYWdFbnRlciArIDFcIlxuICAgICAgICAoZHJhZ0xlYXZlKT1cImV2ZW50RHJhZ0VudGVyID0gZXZlbnREcmFnRW50ZXIgLSAxXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtZGF5LWNvbHVtbnNcIj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzcz1cImNhbC10aW1lLWxhYmVsLWNvbHVtblwiXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJhbGxEYXlFdmVudHNMYWJlbFRlbXBsYXRlXCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtZGF5LWNvbHVtblwiXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgZGF5IG9mIGRheXM7IHRyYWNrQnk6dHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlXCJcbiAgICAgICAgICAgIG13bERyb3BwYWJsZVxuICAgICAgICAgICAgZHJhZ092ZXJDbGFzcz1cImNhbC1kcmFnLW92ZXJcIlxuICAgICAgICAgICAgKGRyb3ApPVwiZXZlbnREcm9wcGVkKCRldmVudCwgZGF5LmRhdGUsIHRydWUpXCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgKm5nRm9yPVwibGV0IGV2ZW50Um93IG9mIHZpZXcuYWxsRGF5RXZlbnRSb3dzOyB0cmFja0J5OnRyYWNrQnlJbmRleFwiXG4gICAgICAgICAgI2V2ZW50Um93Q29udGFpbmVyXG4gICAgICAgICAgY2xhc3M9XCJjYWwtZXZlbnRzLXJvd1wiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBhbGxEYXlFdmVudCBvZiBldmVudFJvdy5yb3c7IHRyYWNrQnk6dHJhY2tCeURheU9yV2Vla0V2ZW50XCJcbiAgICAgICAgICAgICNldmVudFxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtZXZlbnQtY29udGFpbmVyXCJcbiAgICAgICAgICAgIFtjbGFzcy5jYWwtZHJhZ2dhYmxlXT1cImFsbERheUV2ZW50LmV2ZW50LmRyYWdnYWJsZSAmJiBhbGxEYXlFdmVudFJlc2l6ZXMuc2l6ZSA9PT0gMFwiXG4gICAgICAgICAgICBbY2xhc3MuY2FsLXN0YXJ0cy13aXRoaW4td2Vla109XCIhYWxsRGF5RXZlbnQuc3RhcnRzQmVmb3JlV2Vla1wiXG4gICAgICAgICAgICBbY2xhc3MuY2FsLWVuZHMtd2l0aGluLXdlZWtdPVwiIWFsbERheUV2ZW50LmVuZHNBZnRlcldlZWtcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwiYWxsRGF5RXZlbnQuZXZlbnQ/LmNzc0NsYXNzXCJcbiAgICAgICAgICAgIFtzdHlsZS53aWR0aC4lXT1cIigxMDAgLyBkYXlzLmxlbmd0aCkgKiBhbGxEYXlFdmVudC5zcGFuXCJcbiAgICAgICAgICAgIFtzdHlsZS5tYXJnaW5MZWZ0LiVdPVwiKDEwMCAvIGRheXMubGVuZ3RoKSAqIGFsbERheUV2ZW50Lm9mZnNldFwiXG4gICAgICAgICAgICBtd2xSZXNpemFibGVcbiAgICAgICAgICAgIFtyZXNpemVTbmFwR3JpZF09XCJ7bGVmdDogZGF5Q29sdW1uV2lkdGgsIHJpZ2h0OiBkYXlDb2x1bW5XaWR0aH1cIlxuICAgICAgICAgICAgW3ZhbGlkYXRlUmVzaXplXT1cInZhbGlkYXRlUmVzaXplXCJcbiAgICAgICAgICAgIChyZXNpemVTdGFydCk9XCJhbGxEYXlFdmVudFJlc2l6ZVN0YXJ0ZWQoZXZlbnRSb3dDb250YWluZXIsIGFsbERheUV2ZW50LCAkZXZlbnQpXCJcbiAgICAgICAgICAgIChyZXNpemluZyk9XCJhbGxEYXlFdmVudFJlc2l6aW5nKGFsbERheUV2ZW50LCAkZXZlbnQsIGRheUNvbHVtbldpZHRoKVwiXG4gICAgICAgICAgICAocmVzaXplRW5kKT1cImFsbERheUV2ZW50UmVzaXplRW5kZWQoYWxsRGF5RXZlbnQpXCJcbiAgICAgICAgICAgIG13bERyYWdnYWJsZVxuICAgICAgICAgICAgZHJhZ0FjdGl2ZUNsYXNzPVwiY2FsLWRyYWctYWN0aXZlXCJcbiAgICAgICAgICAgIFtkcm9wRGF0YV09XCJ7ZXZlbnQ6IGFsbERheUV2ZW50LmV2ZW50LCBjYWxlbmRhcklkOiBjYWxlbmRhcklkfVwiXG4gICAgICAgICAgICBbZHJhZ0F4aXNdPVwie1xuICAgICAgICAgICAgICB4OiBhbGxEYXlFdmVudC5ldmVudC5kcmFnZ2FibGUgJiYgYWxsRGF5RXZlbnRSZXNpemVzLnNpemUgPT09IDAsXG4gICAgICAgICAgICAgIHk6ICFzbmFwRHJhZ2dlZEV2ZW50cyAmJiBhbGxEYXlFdmVudC5ldmVudC5kcmFnZ2FibGUgJiYgYWxsRGF5RXZlbnRSZXNpemVzLnNpemUgPT09IDBcbiAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgW2RyYWdTbmFwR3JpZF09XCJzbmFwRHJhZ2dlZEV2ZW50cyA/IHt4OiBkYXlDb2x1bW5XaWR0aH0gOiB7fVwiXG4gICAgICAgICAgICBbdmFsaWRhdGVEcmFnXT1cInZhbGlkYXRlRHJhZ1wiXG4gICAgICAgICAgICAoZHJhZ1BvaW50ZXJEb3duKT1cImRyYWdTdGFydGVkKGV2ZW50Um93Q29udGFpbmVyLCBldmVudClcIlxuICAgICAgICAgICAgKGRyYWdFbmQpPVwiZHJhZ0VuZGVkKGFsbERheUV2ZW50LCAkZXZlbnQsIGRheUNvbHVtbldpZHRoKVwiPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzcz1cImNhbC1yZXNpemUtaGFuZGxlIGNhbC1yZXNpemUtaGFuZGxlLWJlZm9yZS1zdGFydFwiXG4gICAgICAgICAgICAgICpuZ0lmPVwiYWxsRGF5RXZlbnQuZXZlbnQ/LnJlc2l6YWJsZT8uYmVmb3JlU3RhcnQgJiYgIWFsbERheUV2ZW50LnN0YXJ0c0JlZm9yZVdlZWtcIlxuICAgICAgICAgICAgICBtd2xSZXNpemVIYW5kbGVcbiAgICAgICAgICAgICAgW3Jlc2l6ZUVkZ2VzXT1cInsgbGVmdDogdHJ1ZSB9XCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxtd2wtY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50XG4gICAgICAgICAgICAgIFt3ZWVrRXZlbnRdPVwiYWxsRGF5RXZlbnRcIlxuICAgICAgICAgICAgICBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgICAgICAgICBbdG9vbHRpcEFwcGVuZFRvQm9keV09XCJ0b29sdGlwQXBwZW5kVG9Cb2R5XCJcbiAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImV2ZW50VGVtcGxhdGVcIlxuICAgICAgICAgICAgICBbZXZlbnRUaXRsZVRlbXBsYXRlXT1cImV2ZW50VGl0bGVUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFtldmVudEFjdGlvbnNUZW1wbGF0ZV09XCJldmVudEFjdGlvbnNUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIChldmVudENsaWNrZWQpPVwiZXZlbnRDbGlja2VkLmVtaXQoe2V2ZW50OiBhbGxEYXlFdmVudC5ldmVudH0pXCI+XG4gICAgICAgICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctZXZlbnQ+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzPVwiY2FsLXJlc2l6ZS1oYW5kbGUgY2FsLXJlc2l6ZS1oYW5kbGUtYWZ0ZXItZW5kXCJcbiAgICAgICAgICAgICAgKm5nSWY9XCJhbGxEYXlFdmVudC5ldmVudD8ucmVzaXphYmxlPy5hZnRlckVuZCAmJiAhYWxsRGF5RXZlbnQuZW5kc0FmdGVyV2Vla1wiXG4gICAgICAgICAgICAgIG13bFJlc2l6ZUhhbmRsZVxuICAgICAgICAgICAgICBbcmVzaXplRWRnZXNdPVwieyByaWdodDogdHJ1ZSB9XCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJjYWwtdGltZS1ldmVudHNcIlxuICAgICAgICBtd2xEcm9wcGFibGVcbiAgICAgICAgKGRyYWdFbnRlcik9XCJldmVudERyYWdFbnRlciA9IGV2ZW50RHJhZ0VudGVyICsgMVwiXG4gICAgICAgIChkcmFnTGVhdmUpPVwiZXZlbnREcmFnRW50ZXIgPSBldmVudERyYWdFbnRlciAtIDFcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhbC10aW1lLWxhYmVsLWNvbHVtblwiICpuZ0lmPVwidmlldy5ob3VyQ29sdW1ucy5sZW5ndGggPiAwXCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGhvdXIgb2Ygdmlldy5ob3VyQ29sdW1uc1swXS5ob3VyczsgdHJhY2tCeTp0cmFja0J5SG91cjsgbGV0IG9kZCA9IG9kZFwiXG4gICAgICAgICAgICBjbGFzcz1cImNhbC1ob3VyXCJcbiAgICAgICAgICAgIFtjbGFzcy5jYWwtaG91ci1vZGRdPVwib2RkXCI+XG4gICAgICAgICAgICA8bXdsLWNhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnRcbiAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IHNlZ21lbnQgb2YgaG91ci5zZWdtZW50czsgdHJhY2tCeTp0cmFja0J5SG91clNlZ21lbnRcIlxuICAgICAgICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cImhvdXJTZWdtZW50SGVpZ2h0XCJcbiAgICAgICAgICAgICAgW3NlZ21lbnRdPVwic2VnbWVudFwiXG4gICAgICAgICAgICAgIFtzZWdtZW50SGVpZ2h0XT1cImhvdXJTZWdtZW50SGVpZ2h0XCJcbiAgICAgICAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxuICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiaG91clNlZ21lbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFtpc1RpbWVMYWJlbF09XCJ0cnVlXCI+XG4gICAgICAgICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctaG91ci1zZWdtZW50PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzPVwiY2FsLWRheS1jb2x1bW5zXCJcbiAgICAgICAgICBbY2xhc3MuY2FsLXJlc2l6ZS1hY3RpdmVdPVwidGltZUV2ZW50UmVzaXplcy5zaXplID4gMFwiXG4gICAgICAgICAgI2RheUNvbHVtbnM+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtZGF5LWNvbHVtblwiXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgY29sdW1uIG9mIHZpZXcuaG91ckNvbHVtbnM7IHRyYWNrQnk6dHJhY2tCeUhvdXJDb2x1bW5cIj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IHRpbWVFdmVudCBvZiBjb2x1bW4uZXZlbnRzOyB0cmFja0J5OnRyYWNrQnlEYXlPcldlZWtFdmVudFwiXG4gICAgICAgICAgICAgICNldmVudFxuICAgICAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1jb250YWluZXJcIlxuICAgICAgICAgICAgICBbY2xhc3MuY2FsLWRyYWdnYWJsZV09XCJ0aW1lRXZlbnQuZXZlbnQuZHJhZ2dhYmxlICYmIHRpbWVFdmVudFJlc2l6ZXMuc2l6ZSA9PT0gMFwiXG4gICAgICAgICAgICAgIFtjbGFzcy5jYWwtc3RhcnRzLXdpdGhpbi1kYXldPVwiIXRpbWVFdmVudC5zdGFydHNCZWZvcmVEYXlcIlxuICAgICAgICAgICAgICBbY2xhc3MuY2FsLWVuZHMtd2l0aGluLWRheV09XCIhdGltZUV2ZW50LmVuZHNBZnRlckRheVwiXG4gICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInRpbWVFdmVudC5ldmVudC5jc3NDbGFzc1wiXG4gICAgICAgICAgICAgIFtoaWRkZW5dPVwidGltZUV2ZW50LmhlaWdodCA9PT0gMCAmJiB0aW1lRXZlbnQud2lkdGggPT09IDBcIlxuICAgICAgICAgICAgICBbc3R5bGUudG9wLnB4XT1cInRpbWVFdmVudC50b3BcIlxuICAgICAgICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cInRpbWVFdmVudC5oZWlnaHRcIlxuICAgICAgICAgICAgICBbc3R5bGUubGVmdC4lXT1cInRpbWVFdmVudC5sZWZ0XCJcbiAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLiVdPVwidGltZUV2ZW50LndpZHRoXCJcbiAgICAgICAgICAgICAgbXdsUmVzaXphYmxlXG4gICAgICAgICAgICAgIFtyZXNpemVTbmFwR3JpZF09XCJ7bGVmdDogZGF5Q29sdW1uV2lkdGgsIHJpZ2h0OiBkYXlDb2x1bW5XaWR0aCwgdG9wOiBldmVudFNuYXBTaXplIHx8IGhvdXJTZWdtZW50SGVpZ2h0LCBib3R0b206IGV2ZW50U25hcFNpemUgfHwgaG91clNlZ21lbnRIZWlnaHR9XCJcbiAgICAgICAgICAgICAgW3ZhbGlkYXRlUmVzaXplXT1cInZhbGlkYXRlUmVzaXplXCJcbiAgICAgICAgICAgICAgW2FsbG93TmVnYXRpdmVSZXNpemVzXT1cInRydWVcIlxuICAgICAgICAgICAgICAocmVzaXplU3RhcnQpPVwidGltZUV2ZW50UmVzaXplU3RhcnRlZChkYXlDb2x1bW5zLCB0aW1lRXZlbnQsICRldmVudClcIlxuICAgICAgICAgICAgICAocmVzaXppbmcpPVwidGltZUV2ZW50UmVzaXppbmcodGltZUV2ZW50LCAkZXZlbnQpXCJcbiAgICAgICAgICAgICAgKHJlc2l6ZUVuZCk9XCJ0aW1lRXZlbnRSZXNpemVFbmRlZCh0aW1lRXZlbnQpXCJcbiAgICAgICAgICAgICAgbXdsRHJhZ2dhYmxlXG4gICAgICAgICAgICAgIGRyYWdBY3RpdmVDbGFzcz1cImNhbC1kcmFnLWFjdGl2ZVwiXG4gICAgICAgICAgICAgIFtkcm9wRGF0YV09XCJ7ZXZlbnQ6IHRpbWVFdmVudC5ldmVudCwgY2FsZW5kYXJJZDogY2FsZW5kYXJJZH1cIlxuICAgICAgICAgICAgICBbZHJhZ0F4aXNdPVwie1xuICAgICAgICAgICAgICAgIHg6IHRpbWVFdmVudC5ldmVudC5kcmFnZ2FibGUgJiYgdGltZUV2ZW50UmVzaXplcy5zaXplID09PSAwLFxuICAgICAgICAgICAgICAgIHk6IHRpbWVFdmVudC5ldmVudC5kcmFnZ2FibGUgJiYgdGltZUV2ZW50UmVzaXplcy5zaXplID09PSAwXG4gICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICBbZHJhZ1NuYXBHcmlkXT1cInNuYXBEcmFnZ2VkRXZlbnRzID8ge3g6IGRheUNvbHVtbldpZHRoLCB5OiBldmVudFNuYXBTaXplIHx8IGhvdXJTZWdtZW50SGVpZ2h0fSA6IHt9XCJcbiAgICAgICAgICAgICAgW2dob3N0RHJhZ0VuYWJsZWRdPVwiIXNuYXBEcmFnZ2VkRXZlbnRzXCJcbiAgICAgICAgICAgICAgW3ZhbGlkYXRlRHJhZ109XCJ2YWxpZGF0ZURyYWdcIlxuICAgICAgICAgICAgICAoZHJhZ1BvaW50ZXJEb3duKT1cImRyYWdTdGFydGVkKGRheUNvbHVtbnMsIGV2ZW50LCB0aW1lRXZlbnQpXCJcbiAgICAgICAgICAgICAgKGRyYWdnaW5nKT1cImRyYWdNb3ZlKHRpbWVFdmVudCwgJGV2ZW50KVwiXG4gICAgICAgICAgICAgIChkcmFnRW5kKT1cImRyYWdFbmRlZCh0aW1lRXZlbnQsICRldmVudCwgZGF5Q29sdW1uV2lkdGgsIHRydWUpXCI+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzcz1cImNhbC1yZXNpemUtaGFuZGxlIGNhbC1yZXNpemUtaGFuZGxlLWJlZm9yZS1zdGFydFwiXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJ0aW1lRXZlbnQuZXZlbnQ/LnJlc2l6YWJsZT8uYmVmb3JlU3RhcnQgJiYgIXRpbWVFdmVudC5zdGFydHNCZWZvcmVEYXlcIlxuICAgICAgICAgICAgICAgIG13bFJlc2l6ZUhhbmRsZVxuICAgICAgICAgICAgICAgIFtyZXNpemVFZGdlc109XCJ7XG4gICAgICAgICAgICAgICAgICBsZWZ0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgdG9wOiB0cnVlXG4gICAgICAgICAgICAgICAgfVwiPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPG13bC1jYWxlbmRhci13ZWVrLXZpZXctZXZlbnRcbiAgICAgICAgICAgICAgICBbd2Vla0V2ZW50XT1cInRpbWVFdmVudFwiXG4gICAgICAgICAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXG4gICAgICAgICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIFt0b29sdGlwQXBwZW5kVG9Cb2R5XT1cInRvb2x0aXBBcHBlbmRUb0JvZHlcIlxuICAgICAgICAgICAgICAgIFt0b29sdGlwRGlzYWJsZWRdPVwiZHJhZ0FjdGl2ZSB8fCB0aW1lRXZlbnRSZXNpemVzLnNpemUgPiAwXCJcbiAgICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgW2V2ZW50VGl0bGVUZW1wbGF0ZV09XCJldmVudFRpdGxlVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIFtldmVudEFjdGlvbnNUZW1wbGF0ZV09XCJldmVudEFjdGlvbnNUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6IHRpbWVFdmVudC5ldmVudH0pXCI+XG4gICAgICAgICAgICAgIDwvbXdsLWNhbGVuZGFyLXdlZWstdmlldy1ldmVudD5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiY2FsLXJlc2l6ZS1oYW5kbGUgY2FsLXJlc2l6ZS1oYW5kbGUtYWZ0ZXItZW5kXCJcbiAgICAgICAgICAgICAgICAqbmdJZj1cInRpbWVFdmVudC5ldmVudD8ucmVzaXphYmxlPy5hZnRlckVuZCAmJiAhdGltZUV2ZW50LmVuZHNBZnRlckRheVwiXG4gICAgICAgICAgICAgICAgbXdsUmVzaXplSGFuZGxlXG4gICAgICAgICAgICAgICAgW3Jlc2l6ZUVkZ2VzXT1cIntcbiAgICAgICAgICAgICAgICAgIHJpZ2h0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgYm90dG9tOiB0cnVlXG4gICAgICAgICAgICAgICAgfVwiPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBob3VyIG9mIGNvbHVtbi5ob3VyczsgdHJhY2tCeTp0cmFja0J5SG91cjsgbGV0IG9kZCA9IG9kZFwiXG4gICAgICAgICAgICAgIGNsYXNzPVwiY2FsLWhvdXJcIlxuICAgICAgICAgICAgICBbY2xhc3MuY2FsLWhvdXItb2RkXT1cIm9kZFwiPlxuICAgICAgICAgICAgICA8bXdsLWNhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnRcbiAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgc2VnbWVudCBvZiBob3VyLnNlZ21lbnRzOyB0cmFja0J5OnRyYWNrQnlIb3VyU2VnbWVudFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLmhlaWdodC5weF09XCJob3VyU2VnbWVudEhlaWdodFwiXG4gICAgICAgICAgICAgICAgW3NlZ21lbnRdPVwic2VnbWVudFwiXG4gICAgICAgICAgICAgICAgW3NlZ21lbnRIZWlnaHRdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICAgIFtsb2NhbGVdPVwibG9jYWxlXCJcbiAgICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiaG91clNlZ21lbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgKG13bENsaWNrKT1cImhvdXJTZWdtZW50Q2xpY2tlZC5lbWl0KHtkYXRlOiBzZWdtZW50LmRhdGV9KVwiXG4gICAgICAgICAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgICAgICAgICAgW2RyYWdPdmVyQ2xhc3NdPVwiIWRyYWdBY3RpdmUgfHwgIXNuYXBEcmFnZ2VkRXZlbnRzID8gJ2NhbC1kcmFnLW92ZXInIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgZHJhZ0FjdGl2ZUNsYXNzPVwiY2FsLWRyYWctYWN0aXZlXCJcbiAgICAgICAgICAgICAgICAoZHJvcCk9XCJldmVudERyb3BwZWQoJGV2ZW50LCBzZWdtZW50LmRhdGUsIGZhbHNlKVwiPlxuICAgICAgICAgICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctaG91ci1zZWdtZW50PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJXZWVrVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmlldyBkYXRlXG4gICAqL1xuICBASW5wdXQoKVxuICB2aWV3RGF0ZTogRGF0ZTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXZlbnRzIHRvIGRpc3BsYXkgb24gdmlld1xuICAgKiBUaGUgc2NoZW1hIGlzIGF2YWlsYWJsZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vbWF0dGxld2lzOTIvY2FsZW5kYXItdXRpbHMvYmxvYi9jNTE2ODk5ODVmNTlhMjcxOTQwZTMwYmM0ZTJjNGUxZmVlM2ZjYjVjL3NyYy9jYWxlbmRhclV0aWxzLnRzI0w0OS1MNjNcbiAgICovXG4gIEBJbnB1dCgpXG4gIGV2ZW50czogQ2FsZW5kYXJFdmVudFtdID0gW107XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGRheSBpbmRleGVzICgwID0gc3VuZGF5LCAxID0gbW9uZGF5IGV0YykgdGhhdCB3aWxsIGJlIGhpZGRlbiBvbiB0aGUgdmlld1xuICAgKi9cbiAgQElucHV0KClcbiAgZXhjbHVkZURheXM6IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIEFuIG9ic2VydmFibGUgdGhhdCB3aGVuIGVtaXR0ZWQgb24gd2lsbCByZS1yZW5kZXIgdGhlIGN1cnJlbnQgdmlld1xuICAgKi9cbiAgQElucHV0KClcbiAgcmVmcmVzaDogU3ViamVjdDxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgbG9jYWxlIHVzZWQgdG8gZm9ybWF0IGRhdGVzXG4gICAqL1xuICBASW5wdXQoKVxuICBsb2NhbGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBsYWNlbWVudCBvZiB0aGUgZXZlbnQgdG9vbHRpcFxuICAgKi9cbiAgQElucHV0KClcbiAgdG9vbHRpcFBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAnYXV0byc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgdGhlIGV2ZW50IHRvb2x0aXBzXG4gICAqL1xuICBASW5wdXQoKVxuICB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXBwZW5kIHRvb2x0aXBzIHRvIHRoZSBib2R5IG9yIG5leHQgdG8gdGhlIHRyaWdnZXIgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KClcbiAgdG9vbHRpcEFwcGVuZFRvQm9keTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGFydCBudW1iZXIgb2YgdGhlIHdlZWtcbiAgICovXG4gIEBJbnB1dCgpXG4gIHdlZWtTdGFydHNPbjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgdG8gcmVwbGFjZSB0aGUgaGVhZGVyXG4gICAqL1xuICBASW5wdXQoKVxuICBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB3ZWVrIHZpZXcgZXZlbnRzXG4gICAqL1xuICBASW5wdXQoKVxuICBldmVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IHRpdGxlc1xuICAgKi9cbiAgQElucHV0KClcbiAgZXZlbnRUaXRsZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IGFjdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpXG4gIGV2ZW50QWN0aW9uc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgcHJlY2lzaW9uIHRvIGRpc3BsYXkgZXZlbnRzLlxuICAgKiBgZGF5c2Agd2lsbCByb3VuZCBldmVudCBzdGFydCBhbmQgZW5kIGRhdGVzIHRvIHRoZSBuZWFyZXN0IGRheSBhbmQgYG1pbnV0ZXNgIHdpbGwgbm90IGRvIHRoaXMgcm91bmRpbmdcbiAgICovXG4gIEBJbnB1dCgpXG4gIHByZWNpc2lvbjogJ2RheXMnIHwgJ21pbnV0ZXMnID0gJ2RheXMnO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBkYXkgaW5kZXhlcyAoMCA9IHN1bmRheSwgMSA9IG1vbmRheSBldGMpIHRoYXQgaW5kaWNhdGUgd2hpY2ggZGF5cyBhcmUgd2Vla2VuZHNcbiAgICovXG4gIEBJbnB1dCgpXG4gIHdlZWtlbmREYXlzOiBudW1iZXJbXTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBzbmFwIGV2ZW50cyB0byBhIGdyaWQgd2hlbiBkcmFnZ2luZ1xuICAgKi9cbiAgQElucHV0KClcbiAgc25hcERyYWdnZWRFdmVudHM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHNlZ21lbnRzIGluIGFuIGhvdXIuIE11c3QgYmUgPD0gNlxuICAgKi9cbiAgQElucHV0KClcbiAgaG91clNlZ21lbnRzOiBudW1iZXIgPSAyO1xuXG4gIC8qKlxuICAgKiBUaGUgaGVpZ2h0IGluIHBpeGVscyBvZiBlYWNoIGhvdXIgc2VnbWVudFxuICAgKi9cbiAgQElucHV0KClcbiAgaG91clNlZ21lbnRIZWlnaHQ6IG51bWJlciA9IDMwO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IHN0YXJ0IGhvdXJzIGluIDI0IGhvdXIgdGltZS4gTXVzdCBiZSAwLTIzXG4gICAqL1xuICBASW5wdXQoKVxuICBkYXlTdGFydEhvdXI6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgc3RhcnQgbWludXRlcy4gTXVzdCBiZSAwLTU5XG4gICAqL1xuICBASW5wdXQoKVxuICBkYXlTdGFydE1pbnV0ZTogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogVGhlIGRheSBlbmQgaG91cnMgaW4gMjQgaG91ciB0aW1lLiBNdXN0IGJlIDAtMjNcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRheUVuZEhvdXI6IG51bWJlciA9IDIzO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IGVuZCBtaW51dGVzLiBNdXN0IGJlIDAtNTlcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRheUVuZE1pbnV0ZTogbnVtYmVyID0gNTk7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBob3VyIHNlZ21lbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGhvdXJTZWdtZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIFRoZSBncmlkIHNpemUgdG8gc25hcCByZXNpemluZyBhbmQgZHJhZ2dpbmcgb2YgaG91cmx5IGV2ZW50cyB0b1xuICAgKi9cbiAgQElucHV0KClcbiAgZXZlbnRTbmFwU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIHRoZSBhbGwgZGF5IGV2ZW50cyBsYWJlbCB0ZXh0XG4gICAqL1xuICBASW5wdXQoKVxuICBhbGxEYXlFdmVudHNMYWJlbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGRheXMgaW4gYSB3ZWVrLiBDYW4gYmUgdXNlZCB0byBjcmVhdGUgYSBzaG9ydGVyIG9yIGxvbmdlciB3ZWVrIHZpZXcuXG4gICAqIFRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsgd2lsbCBhbHdheXMgYmUgdGhlIGB2aWV3RGF0ZWBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRheXNJbldlZWs6IG51bWJlcjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSBoZWFkZXIgd2VlayBkYXkgaXMgY2xpY2tlZC4gQWRkaW5nIGEgYGNzc0NsYXNzYCBwcm9wZXJ0eSBvbiBgJGV2ZW50LmRheWAgd2lsbCBhZGQgdGhhdCBjbGFzcyB0byB0aGUgaGVhZGVyIGVsZW1lbnRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBkYXlIZWFkZXJDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgZGF5OiBXZWVrRGF5O1xuICB9PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgZXZlbnQgdGl0bGUgaXMgY2xpY2tlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGV2ZW50Q2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8e1xuICAgIGV2ZW50OiBDYWxlbmRhckV2ZW50O1xuICB9PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhbiBldmVudCBpcyByZXNpemVkIG9yIGRyYWdnZWQgYW5kIGRyb3BwZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBldmVudFRpbWVzQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBBbiBvdXRwdXQgdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHZpZXcgaXMgcmVuZGVyZWQgZm9yIHRoZSBjdXJyZW50IHdlZWsuXG4gICAqIElmIHlvdSBhZGQgdGhlIGBjc3NDbGFzc2AgcHJvcGVydHkgdG8gYSBkYXkgaW4gdGhlIGhlYWRlciBpdCB3aWxsIGFkZCB0aGF0IGNsYXNzIHRvIHRoZSBjZWxsIGVsZW1lbnQgaW4gdGhlIHRlbXBsYXRlXG4gICAqL1xuICBAT3V0cHV0KClcbiAgYmVmb3JlVmlld1JlbmRlciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2FsZW5kYXJXZWVrVmlld0JlZm9yZVJlbmRlckV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhbiBob3VyIHNlZ21lbnQgaXMgY2xpY2tlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGhvdXJTZWdtZW50Q2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8e1xuICAgIGRhdGU6IERhdGU7XG4gIH0+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGRheXM6IFdlZWtEYXlbXTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdmlldzogV2Vla1ZpZXc7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHJlZnJlc2hTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgYWxsRGF5RXZlbnRSZXNpemVzOiBNYXA8XG4gICAgV2Vla1ZpZXdBbGxEYXlFdmVudCxcbiAgICBXZWVrVmlld0FsbERheUV2ZW50UmVzaXplXG4gID4gPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRpbWVFdmVudFJlc2l6ZXM6IE1hcDxDYWxlbmRhckV2ZW50LCBSZXNpemVFdmVudD4gPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGV2ZW50RHJhZ0VudGVyID0gMDtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZHJhZ0FjdGl2ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB2YWxpZGF0ZURyYWc6IChhcmdzOiBhbnkpID0+IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHZhbGlkYXRlUmVzaXplOiAoYXJnczogYW55KSA9PiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBkYXlDb2x1bW5XaWR0aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBjYWxlbmRhcklkID0gU3ltYm9sKCdhbmd1bGFyIGNhbGVuZGFyIHdlZWsgdmlldyBpZCcpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5SW5kZXggPSB0cmFja0J5SW5kZXg7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZSA9IHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdHJhY2tCeUhvdXJTZWdtZW50ID0gdHJhY2tCeUhvdXJTZWdtZW50O1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5SG91ciA9IHRyYWNrQnlIb3VyO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5RGF5T3JXZWVrRXZlbnQgPSB0cmFja0J5RGF5T3JXZWVrRXZlbnQ7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRyYWNrQnlIb3VyQ29sdW1uID0gKGluZGV4OiBudW1iZXIsIGNvbHVtbjogV2Vla1ZpZXdIb3VyQ29sdW1uKSA9PlxuICAgIGNvbHVtbi5ob3Vyc1swXSA/IGNvbHVtbi5ob3Vyc1swXS5zZWdtZW50c1swXS5kYXRlLnRvSVNPU3RyaW5nKCkgOiBjb2x1bW47XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHV0aWxzOiBDYWxlbmRhclV0aWxzLFxuICAgIEBJbmplY3QoTE9DQUxFX0lEKSBsb2NhbGU6IHN0cmluZyxcbiAgICBwcml2YXRlIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlclxuICApIHtcbiAgICB0aGlzLmxvY2FsZSA9IGxvY2FsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZWZyZXNoKSB7XG4gICAgICB0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24gPSB0aGlzLnJlZnJlc2guc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5yZWZyZXNoQWxsKCk7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZXMudmlld0RhdGUgfHxcbiAgICAgIGNoYW5nZXMuZXhjbHVkZURheXMgfHxcbiAgICAgIGNoYW5nZXMud2Vla2VuZERheXMgfHxcbiAgICAgIGNoYW5nZXMuZGF5c0luV2Vla1xuICAgICkge1xuICAgICAgdGhpcy5yZWZyZXNoSGVhZGVyKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuZXZlbnRzKSB7XG4gICAgICB2YWxpZGF0ZUV2ZW50cyh0aGlzLmV2ZW50cyk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgY2hhbmdlcy52aWV3RGF0ZSB8fFxuICAgICAgY2hhbmdlcy5kYXlTdGFydEhvdXIgfHxcbiAgICAgIGNoYW5nZXMuZGF5U3RhcnRNaW51dGUgfHxcbiAgICAgIGNoYW5nZXMuZGF5RW5kSG91ciB8fFxuICAgICAgY2hhbmdlcy5kYXlFbmRNaW51dGUgfHxcbiAgICAgIGNoYW5nZXMuaG91clNlZ21lbnRzIHx8XG4gICAgICBjaGFuZ2VzLndlZWtTdGFydHNPbiB8fFxuICAgICAgY2hhbmdlcy53ZWVrZW5kRGF5cyB8fFxuICAgICAgY2hhbmdlcy5leGNsdWRlRGF5cyB8fFxuICAgICAgY2hhbmdlcy5ob3VyU2VnbWVudEhlaWdodCB8fFxuICAgICAgY2hhbmdlcy5ldmVudHMgfHxcbiAgICAgIGNoYW5nZXMuZGF5c0luV2Vla1xuICAgICkge1xuICAgICAgdGhpcy5yZWZyZXNoQm9keSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc2l6ZVN0YXJ0ZWQoZXZlbnRzQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgbWluV2lkdGg/OiBudW1iZXIpIHtcbiAgICB0aGlzLmRheUNvbHVtbldpZHRoID0gdGhpcy5nZXREYXlDb2x1bW5XaWR0aChldmVudHNDb250YWluZXIpO1xuICAgIGNvbnN0IHJlc2l6ZUhlbHBlcjogQ2FsZW5kYXJSZXNpemVIZWxwZXIgPSBuZXcgQ2FsZW5kYXJSZXNpemVIZWxwZXIoXG4gICAgICBldmVudHNDb250YWluZXIsXG4gICAgICBtaW5XaWR0aFxuICAgICk7XG4gICAgdGhpcy52YWxpZGF0ZVJlc2l6ZSA9ICh7IHJlY3RhbmdsZSB9KSA9PlxuICAgICAgcmVzaXplSGVscGVyLnZhbGlkYXRlUmVzaXplKHsgcmVjdGFuZ2xlIH0pO1xuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRpbWVFdmVudFJlc2l6ZVN0YXJ0ZWQoXG4gICAgZXZlbnRzQ29udGFpbmVyOiBIVE1MRWxlbWVudCxcbiAgICB0aW1lRXZlbnQ6IERheVZpZXdFdmVudCxcbiAgICByZXNpemVFdmVudDogUmVzaXplRXZlbnRcbiAgKTogdm9pZCB7XG4gICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLnNldCh0aW1lRXZlbnQuZXZlbnQsIHJlc2l6ZUV2ZW50KTtcbiAgICB0aGlzLnJlc2l6ZVN0YXJ0ZWQoZXZlbnRzQ29udGFpbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0aW1lRXZlbnRSZXNpemluZyh0aW1lRXZlbnQ6IERheVZpZXdFdmVudCwgcmVzaXplRXZlbnQ6IFJlc2l6ZUV2ZW50KSB7XG4gICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLnNldCh0aW1lRXZlbnQuZXZlbnQsIHJlc2l6ZUV2ZW50KTtcbiAgICBjb25zdCBhZGp1c3RlZEV2ZW50cyA9IG5ldyBNYXA8Q2FsZW5kYXJFdmVudCwgQ2FsZW5kYXJFdmVudD4oKTtcblxuICAgIGNvbnN0IHRlbXBFdmVudHMgPSBbLi4udGhpcy5ldmVudHNdO1xuXG4gICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLmZvckVhY2goKGxhc3RSZXNpemVFdmVudCwgZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IG5ld0V2ZW50RGF0ZXMgPSB0aGlzLmdldFRpbWVFdmVudFJlc2l6ZWREYXRlcyhcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGxhc3RSZXNpemVFdmVudFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGFkanVzdGVkRXZlbnQgPSB7IC4uLmV2ZW50LCAuLi5uZXdFdmVudERhdGVzIH07XG4gICAgICBhZGp1c3RlZEV2ZW50cy5zZXQoYWRqdXN0ZWRFdmVudCwgZXZlbnQpO1xuICAgICAgY29uc3QgZXZlbnRJbmRleCA9IHRlbXBFdmVudHMuaW5kZXhPZihldmVudCk7XG4gICAgICB0ZW1wRXZlbnRzW2V2ZW50SW5kZXhdID0gYWRqdXN0ZWRFdmVudDtcbiAgICB9KTtcblxuICAgIHRoaXMucmVzdG9yZU9yaWdpbmFsRXZlbnRzKHRlbXBFdmVudHMsIGFkanVzdGVkRXZlbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0aW1lRXZlbnRSZXNpemVFbmRlZCh0aW1lRXZlbnQ6IERheVZpZXdFdmVudCkge1xuICAgIHRoaXMudmlldyA9IHRoaXMuZ2V0V2Vla1ZpZXcodGhpcy5ldmVudHMpO1xuICAgIGNvbnN0IGxhc3RSZXNpemVFdmVudCA9IHRoaXMudGltZUV2ZW50UmVzaXplcy5nZXQodGltZUV2ZW50LmV2ZW50KTtcbiAgICB0aGlzLnRpbWVFdmVudFJlc2l6ZXMuZGVsZXRlKHRpbWVFdmVudC5ldmVudCk7XG4gICAgY29uc3QgbmV3RXZlbnREYXRlcyA9IHRoaXMuZ2V0VGltZUV2ZW50UmVzaXplZERhdGVzKFxuICAgICAgdGltZUV2ZW50LmV2ZW50LFxuICAgICAgbGFzdFJlc2l6ZUV2ZW50XG4gICAgKTtcbiAgICB0aGlzLmV2ZW50VGltZXNDaGFuZ2VkLmVtaXQoe1xuICAgICAgbmV3U3RhcnQ6IG5ld0V2ZW50RGF0ZXMuc3RhcnQsXG4gICAgICBuZXdFbmQ6IG5ld0V2ZW50RGF0ZXMuZW5kLFxuICAgICAgZXZlbnQ6IHRpbWVFdmVudC5ldmVudCxcbiAgICAgIHR5cGU6IENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFR5cGUuUmVzaXplXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgYWxsRGF5RXZlbnRSZXNpemVTdGFydGVkKFxuICAgIGFsbERheUV2ZW50c0NvbnRhaW5lcjogSFRNTEVsZW1lbnQsXG4gICAgYWxsRGF5RXZlbnQ6IFdlZWtWaWV3QWxsRGF5RXZlbnQsXG4gICAgcmVzaXplRXZlbnQ6IFJlc2l6ZUV2ZW50XG4gICk6IHZvaWQge1xuICAgIHRoaXMuYWxsRGF5RXZlbnRSZXNpemVzLnNldChhbGxEYXlFdmVudCwge1xuICAgICAgb3JpZ2luYWxPZmZzZXQ6IGFsbERheUV2ZW50Lm9mZnNldCxcbiAgICAgIG9yaWdpbmFsU3BhbjogYWxsRGF5RXZlbnQuc3BhbixcbiAgICAgIGVkZ2U6IHR5cGVvZiByZXNpemVFdmVudC5lZGdlcy5sZWZ0ICE9PSAndW5kZWZpbmVkJyA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB9KTtcbiAgICB0aGlzLnJlc2l6ZVN0YXJ0ZWQoXG4gICAgICBhbGxEYXlFdmVudHNDb250YWluZXIsXG4gICAgICB0aGlzLmdldERheUNvbHVtbldpZHRoKGFsbERheUV2ZW50c0NvbnRhaW5lcilcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGFsbERheUV2ZW50UmVzaXppbmcoXG4gICAgYWxsRGF5RXZlbnQ6IFdlZWtWaWV3QWxsRGF5RXZlbnQsXG4gICAgcmVzaXplRXZlbnQ6IFJlc2l6ZUV2ZW50LFxuICAgIGRheVdpZHRoOiBudW1iZXJcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudFJlc2l6ZTogV2Vla1ZpZXdBbGxEYXlFdmVudFJlc2l6ZSA9IHRoaXMuYWxsRGF5RXZlbnRSZXNpemVzLmdldChcbiAgICAgIGFsbERheUV2ZW50XG4gICAgKTtcblxuICAgIGlmIChyZXNpemVFdmVudC5lZGdlcy5sZWZ0KSB7XG4gICAgICBjb25zdCBkaWZmOiBudW1iZXIgPSBNYXRoLnJvdW5kKCtyZXNpemVFdmVudC5lZGdlcy5sZWZ0IC8gZGF5V2lkdGgpO1xuICAgICAgYWxsRGF5RXZlbnQub2Zmc2V0ID0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbE9mZnNldCArIGRpZmY7XG4gICAgICBhbGxEYXlFdmVudC5zcGFuID0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbFNwYW4gLSBkaWZmO1xuICAgIH0gZWxzZSBpZiAocmVzaXplRXZlbnQuZWRnZXMucmlnaHQpIHtcbiAgICAgIGNvbnN0IGRpZmY6IG51bWJlciA9IE1hdGgucm91bmQoK3Jlc2l6ZUV2ZW50LmVkZ2VzLnJpZ2h0IC8gZGF5V2lkdGgpO1xuICAgICAgYWxsRGF5RXZlbnQuc3BhbiA9IGN1cnJlbnRSZXNpemUub3JpZ2luYWxTcGFuICsgZGlmZjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgYWxsRGF5RXZlbnRSZXNpemVFbmRlZChhbGxEYXlFdmVudDogV2Vla1ZpZXdBbGxEYXlFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRSZXNpemU6IFdlZWtWaWV3QWxsRGF5RXZlbnRSZXNpemUgPSB0aGlzLmFsbERheUV2ZW50UmVzaXplcy5nZXQoXG4gICAgICBhbGxEYXlFdmVudFxuICAgICk7XG5cbiAgICBjb25zdCBhbGxEYXlFdmVudFJlc2l6aW5nQmVmb3JlU3RhcnQgPSBjdXJyZW50UmVzaXplLmVkZ2UgPT09ICdsZWZ0JztcbiAgICBsZXQgZGF5c0RpZmY6IG51bWJlcjtcbiAgICBpZiAoYWxsRGF5RXZlbnRSZXNpemluZ0JlZm9yZVN0YXJ0KSB7XG4gICAgICBkYXlzRGlmZiA9IGFsbERheUV2ZW50Lm9mZnNldCAtIGN1cnJlbnRSZXNpemUub3JpZ2luYWxPZmZzZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRheXNEaWZmID0gYWxsRGF5RXZlbnQuc3BhbiAtIGN1cnJlbnRSZXNpemUub3JpZ2luYWxTcGFuO1xuICAgIH1cblxuICAgIGFsbERheUV2ZW50Lm9mZnNldCA9IGN1cnJlbnRSZXNpemUub3JpZ2luYWxPZmZzZXQ7XG4gICAgYWxsRGF5RXZlbnQuc3BhbiA9IGN1cnJlbnRSZXNpemUub3JpZ2luYWxTcGFuO1xuXG4gICAgbGV0IG5ld1N0YXJ0OiBEYXRlID0gYWxsRGF5RXZlbnQuZXZlbnQuc3RhcnQ7XG4gICAgbGV0IG5ld0VuZDogRGF0ZSA9IGFsbERheUV2ZW50LmV2ZW50LmVuZCB8fCBhbGxEYXlFdmVudC5ldmVudC5zdGFydDtcbiAgICBpZiAoYWxsRGF5RXZlbnRSZXNpemluZ0JlZm9yZVN0YXJ0KSB7XG4gICAgICBuZXdTdGFydCA9IHRoaXMuZGF0ZUFkYXB0ZXIuYWRkRGF5cyhuZXdTdGFydCwgZGF5c0RpZmYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdFbmQgPSB0aGlzLmRhdGVBZGFwdGVyLmFkZERheXMobmV3RW5kLCBkYXlzRGlmZik7XG4gICAgfVxuXG4gICAgdGhpcy5ldmVudFRpbWVzQ2hhbmdlZC5lbWl0KHtcbiAgICAgIG5ld1N0YXJ0LFxuICAgICAgbmV3RW5kLFxuICAgICAgZXZlbnQ6IGFsbERheUV2ZW50LmV2ZW50LFxuICAgICAgdHlwZTogQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50VHlwZS5SZXNpemVcbiAgICB9KTtcbiAgICB0aGlzLmFsbERheUV2ZW50UmVzaXplcy5kZWxldGUoYWxsRGF5RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGdldERheUNvbHVtbldpZHRoKGV2ZW50Um93Q29udGFpbmVyOiBIVE1MRWxlbWVudCk6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoZXZlbnRSb3dDb250YWluZXIub2Zmc2V0V2lkdGggLyB0aGlzLmRheXMubGVuZ3RoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBldmVudERyb3BwZWQoXG4gICAgZHJvcEV2ZW50OiBEcm9wRXZlbnQ8eyBldmVudD86IENhbGVuZGFyRXZlbnQ7IGNhbGVuZGFySWQ/OiBzeW1ib2wgfT4sXG4gICAgZGF0ZTogRGF0ZSxcbiAgICBhbGxEYXk6IGJvb2xlYW5cbiAgKTogdm9pZCB7XG4gICAgaWYgKHNob3VsZEZpcmVEcm9wcGVkRXZlbnQoZHJvcEV2ZW50LCBkYXRlLCBhbGxEYXksIHRoaXMuY2FsZW5kYXJJZCkpIHtcbiAgICAgIHRoaXMuZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCh7XG4gICAgICAgIHR5cGU6IENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFR5cGUuRHJvcCxcbiAgICAgICAgZXZlbnQ6IGRyb3BFdmVudC5kcm9wRGF0YS5ldmVudCxcbiAgICAgICAgbmV3U3RhcnQ6IGRhdGUsXG4gICAgICAgIGFsbERheVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGRyYWdTdGFydGVkKFxuICAgIGV2ZW50c0NvbnRhaW5lcjogSFRNTEVsZW1lbnQsXG4gICAgZXZlbnQ6IEhUTUxFbGVtZW50LFxuICAgIGRheUV2ZW50PzogRGF5Vmlld0V2ZW50XG4gICk6IHZvaWQge1xuICAgIHRoaXMuZGF5Q29sdW1uV2lkdGggPSB0aGlzLmdldERheUNvbHVtbldpZHRoKGV2ZW50c0NvbnRhaW5lcik7XG4gICAgY29uc3QgZHJhZ0hlbHBlcjogQ2FsZW5kYXJEcmFnSGVscGVyID0gbmV3IENhbGVuZGFyRHJhZ0hlbHBlcihcbiAgICAgIGV2ZW50c0NvbnRhaW5lcixcbiAgICAgIGV2ZW50XG4gICAgKTtcbiAgICB0aGlzLnZhbGlkYXRlRHJhZyA9ICh7IHgsIHkgfSkgPT5cbiAgICAgIHRoaXMuYWxsRGF5RXZlbnRSZXNpemVzLnNpemUgPT09IDAgJiZcbiAgICAgIHRoaXMudGltZUV2ZW50UmVzaXplcy5zaXplID09PSAwICYmXG4gICAgICBkcmFnSGVscGVyLnZhbGlkYXRlRHJhZyh7XG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHNuYXBEcmFnZ2VkRXZlbnRzOiB0aGlzLnNuYXBEcmFnZ2VkRXZlbnRzXG4gICAgICB9KTtcbiAgICB0aGlzLmRyYWdBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuZXZlbnREcmFnRW50ZXIgPSAwO1xuICAgIGlmICghdGhpcy5zbmFwRHJhZ2dlZEV2ZW50cyAmJiBkYXlFdmVudCkge1xuICAgICAgdGhpcy52aWV3LmhvdXJDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgY29uc3QgbGlua2VkRXZlbnQgPSBjb2x1bW4uZXZlbnRzLmZpbmQoXG4gICAgICAgICAgY29sdW1uRXZlbnQgPT5cbiAgICAgICAgICAgIGNvbHVtbkV2ZW50LmV2ZW50ID09PSBkYXlFdmVudC5ldmVudCAmJiBjb2x1bW5FdmVudCAhPT0gZGF5RXZlbnRcbiAgICAgICAgKTtcbiAgICAgICAgLy8gaGlkZSBhbnkgbGlua2VkIGV2ZW50cyB3aGlsZSBkcmFnZ2luZ1xuICAgICAgICBpZiAobGlua2VkRXZlbnQpIHtcbiAgICAgICAgICBsaW5rZWRFdmVudC53aWR0aCA9IDA7XG4gICAgICAgICAgbGlua2VkRXZlbnQuaGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGRyYWdNb3ZlKGRheUV2ZW50OiBEYXlWaWV3RXZlbnQsIGRyYWdFdmVudDogRHJhZ01vdmVFdmVudCkge1xuICAgIGlmICh0aGlzLnNuYXBEcmFnZ2VkRXZlbnRzKSB7XG4gICAgICBjb25zdCBuZXdFdmVudFRpbWVzID0gdGhpcy5nZXREcmFnTW92ZWRFdmVudFRpbWVzKFxuICAgICAgICBkYXlFdmVudCxcbiAgICAgICAgZHJhZ0V2ZW50LFxuICAgICAgICB0aGlzLmRheUNvbHVtbldpZHRoLFxuICAgICAgICB0cnVlXG4gICAgICApO1xuICAgICAgY29uc3Qgb3JpZ2luYWxFdmVudCA9IGRheUV2ZW50LmV2ZW50O1xuICAgICAgY29uc3QgYWRqdXN0ZWRFdmVudCA9IHsgLi4ub3JpZ2luYWxFdmVudCwgLi4ubmV3RXZlbnRUaW1lcyB9O1xuICAgICAgY29uc3QgdGVtcEV2ZW50cyA9IHRoaXMuZXZlbnRzLm1hcChldmVudCA9PiB7XG4gICAgICAgIGlmIChldmVudCA9PT0gb3JpZ2luYWxFdmVudCkge1xuICAgICAgICAgIHJldHVybiBhZGp1c3RlZEV2ZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBldmVudDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZXN0b3JlT3JpZ2luYWxFdmVudHMoXG4gICAgICAgIHRlbXBFdmVudHMsXG4gICAgICAgIG5ldyBNYXAoW1thZGp1c3RlZEV2ZW50LCBvcmlnaW5hbEV2ZW50XV0pXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBkcmFnRW5kZWQoXG4gICAgd2Vla0V2ZW50OiBXZWVrVmlld0FsbERheUV2ZW50IHwgRGF5Vmlld0V2ZW50LFxuICAgIGRyYWdFbmRFdmVudDogRHJhZ0VuZEV2ZW50LFxuICAgIGRheVdpZHRoOiBudW1iZXIsXG4gICAgdXNlWSA9IGZhbHNlXG4gICk6IHZvaWQge1xuICAgIHRoaXMudmlldyA9IHRoaXMuZ2V0V2Vla1ZpZXcodGhpcy5ldmVudHMpO1xuICAgIHRoaXMuZHJhZ0FjdGl2ZSA9IGZhbHNlO1xuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gdGhpcy5nZXREcmFnTW92ZWRFdmVudFRpbWVzKFxuICAgICAgd2Vla0V2ZW50LFxuICAgICAgZHJhZ0VuZEV2ZW50LFxuICAgICAgZGF5V2lkdGgsXG4gICAgICB1c2VZXG4gICAgKTtcbiAgICBpZiAoXG4gICAgICB0aGlzLmV2ZW50RHJhZ0VudGVyID4gMCAmJlxuICAgICAgaXNEcmFnZ2VkV2l0aGluUGVyaW9kKHN0YXJ0LCBlbmQsIHRoaXMudmlldy5wZXJpb2QpXG4gICAgKSB7XG4gICAgICB0aGlzLmV2ZW50VGltZXNDaGFuZ2VkLmVtaXQoe1xuICAgICAgICBuZXdTdGFydDogc3RhcnQsXG4gICAgICAgIG5ld0VuZDogZW5kLFxuICAgICAgICBldmVudDogd2Vla0V2ZW50LmV2ZW50LFxuICAgICAgICB0eXBlOiBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLkRyYWcsXG4gICAgICAgIGFsbERheTogIXVzZVlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaEhlYWRlcigpOiB2b2lkIHtcbiAgICB0aGlzLmRheXMgPSB0aGlzLnV0aWxzLmdldFdlZWtWaWV3SGVhZGVyKHtcbiAgICAgIHZpZXdEYXRlOiB0aGlzLnZpZXdEYXRlLFxuICAgICAgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVkOiB0aGlzLmV4Y2x1ZGVEYXlzLFxuICAgICAgd2Vla2VuZERheXM6IHRoaXMud2Vla2VuZERheXMsXG4gICAgICAuLi5nZXRXZWVrVmlld1BlcmlvZChcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgdGhpcy52aWV3RGF0ZSxcbiAgICAgICAgdGhpcy53ZWVrU3RhcnRzT24sXG4gICAgICAgIHRoaXMuZXhjbHVkZURheXMsXG4gICAgICAgIHRoaXMuZGF5c0luV2Vla1xuICAgICAgKVxuICAgIH0pO1xuICAgIHRoaXMuZW1pdEJlZm9yZVZpZXdSZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaEJvZHkoKTogdm9pZCB7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5nZXRXZWVrVmlldyh0aGlzLmV2ZW50cyk7XG4gICAgdGhpcy5lbWl0QmVmb3JlVmlld1JlbmRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoQWxsKCk6IHZvaWQge1xuICAgIHRoaXMucmVmcmVzaEhlYWRlcigpO1xuICAgIHRoaXMucmVmcmVzaEJvZHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdEJlZm9yZVZpZXdSZW5kZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF5cyAmJiB0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMuYmVmb3JlVmlld1JlbmRlci5lbWl0KHtcbiAgICAgICAgaGVhZGVyOiB0aGlzLmRheXMsXG4gICAgICAgIC4uLnRoaXMudmlld1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRXZWVrVmlldyhldmVudHM6IENhbGVuZGFyRXZlbnRbXSkge1xuICAgIHJldHVybiB0aGlzLnV0aWxzLmdldFdlZWtWaWV3KHtcbiAgICAgIGV2ZW50cyxcbiAgICAgIHZpZXdEYXRlOiB0aGlzLnZpZXdEYXRlLFxuICAgICAgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVkOiB0aGlzLmV4Y2x1ZGVEYXlzLFxuICAgICAgcHJlY2lzaW9uOiB0aGlzLnByZWNpc2lvbixcbiAgICAgIGFic29sdXRlUG9zaXRpb25lZEV2ZW50czogdHJ1ZSxcbiAgICAgIGhvdXJTZWdtZW50czogdGhpcy5ob3VyU2VnbWVudHMsXG4gICAgICBkYXlTdGFydDoge1xuICAgICAgICBob3VyOiB0aGlzLmRheVN0YXJ0SG91cixcbiAgICAgICAgbWludXRlOiB0aGlzLmRheVN0YXJ0TWludXRlXG4gICAgICB9LFxuICAgICAgZGF5RW5kOiB7XG4gICAgICAgIGhvdXI6IHRoaXMuZGF5RW5kSG91cixcbiAgICAgICAgbWludXRlOiB0aGlzLmRheUVuZE1pbnV0ZVxuICAgICAgfSxcbiAgICAgIHNlZ21lbnRIZWlnaHQ6IHRoaXMuaG91clNlZ21lbnRIZWlnaHQsXG4gICAgICB3ZWVrZW5kRGF5czogdGhpcy53ZWVrZW5kRGF5cyxcbiAgICAgIC4uLmdldFdlZWtWaWV3UGVyaW9kKFxuICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLFxuICAgICAgICB0aGlzLnZpZXdEYXRlLFxuICAgICAgICB0aGlzLndlZWtTdGFydHNPbixcbiAgICAgICAgdGhpcy5leGNsdWRlRGF5cyxcbiAgICAgICAgdGhpcy5kYXlzSW5XZWVrXG4gICAgICApXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldERyYWdNb3ZlZEV2ZW50VGltZXMoXG4gICAgd2Vla0V2ZW50OiBXZWVrVmlld0FsbERheUV2ZW50IHwgRGF5Vmlld0V2ZW50LFxuICAgIGRyYWdFbmRFdmVudDogRHJhZ0VuZEV2ZW50IHwgRHJhZ01vdmVFdmVudCxcbiAgICBkYXlXaWR0aDogbnVtYmVyLFxuICAgIHVzZVk6IGJvb2xlYW5cbiAgKSB7XG4gICAgY29uc3QgZGF5c0RyYWdnZWQgPSByb3VuZFRvTmVhcmVzdChkcmFnRW5kRXZlbnQueCwgZGF5V2lkdGgpIC8gZGF5V2lkdGg7XG4gICAgY29uc3QgbWludXRlc01vdmVkID0gdXNlWVxuICAgICAgPyBnZXRNaW51dGVzTW92ZWQoXG4gICAgICAgICAgZHJhZ0VuZEV2ZW50LnksXG4gICAgICAgICAgdGhpcy5ob3VyU2VnbWVudHMsXG4gICAgICAgICAgdGhpcy5ob3VyU2VnbWVudEhlaWdodCxcbiAgICAgICAgICB0aGlzLmV2ZW50U25hcFNpemVcbiAgICAgICAgKVxuICAgICAgOiAwO1xuXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmRhdGVBZGFwdGVyLmFkZE1pbnV0ZXMoXG4gICAgICB0aGlzLmRhdGVBZGFwdGVyLmFkZERheXMod2Vla0V2ZW50LmV2ZW50LnN0YXJ0LCBkYXlzRHJhZ2dlZCksXG4gICAgICBtaW51dGVzTW92ZWRcbiAgICApO1xuICAgIGxldCBlbmQ6IERhdGU7XG4gICAgaWYgKHdlZWtFdmVudC5ldmVudC5lbmQpIHtcbiAgICAgIGVuZCA9IHRoaXMuZGF0ZUFkYXB0ZXIuYWRkTWludXRlcyhcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlci5hZGREYXlzKHdlZWtFdmVudC5ldmVudC5lbmQsIGRheXNEcmFnZ2VkKSxcbiAgICAgICAgbWludXRlc01vdmVkXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzdG9yZU9yaWdpbmFsRXZlbnRzKFxuICAgIHRlbXBFdmVudHM6IENhbGVuZGFyRXZlbnRbXSxcbiAgICBhZGp1c3RlZEV2ZW50czogTWFwPENhbGVuZGFyRXZlbnQsIENhbGVuZGFyRXZlbnQ+XG4gICkge1xuICAgIHRoaXMudmlldyA9IHRoaXMuZ2V0V2Vla1ZpZXcodGVtcEV2ZW50cyk7XG4gICAgY29uc3QgYWRqdXN0ZWRFdmVudHNBcnJheSA9IHRlbXBFdmVudHMuZmlsdGVyKGV2ZW50ID0+XG4gICAgICBhZGp1c3RlZEV2ZW50cy5oYXMoZXZlbnQpXG4gICAgKTtcbiAgICB0aGlzLnZpZXcuaG91ckNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgYWRqdXN0ZWRFdmVudHNBcnJheS5mb3JFYWNoKGFkanVzdGVkRXZlbnQgPT4ge1xuICAgICAgICBjb25zdCBvcmlnaW5hbEV2ZW50ID0gYWRqdXN0ZWRFdmVudHMuZ2V0KGFkanVzdGVkRXZlbnQpO1xuICAgICAgICBjb25zdCBleGlzdGluZ0NvbHVtbkV2ZW50ID0gY29sdW1uLmV2ZW50cy5maW5kKFxuICAgICAgICAgIGNvbHVtbkV2ZW50ID0+IGNvbHVtbkV2ZW50LmV2ZW50ID09PSBhZGp1c3RlZEV2ZW50XG4gICAgICAgICk7XG4gICAgICAgIGlmIChleGlzdGluZ0NvbHVtbkV2ZW50KSB7XG4gICAgICAgICAgLy8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgZXZlbnQgc28gdHJhY2tCeSBraWNrcyBpbiBhbmQgdGhlIGRvbSBpc24ndCBjaGFuZ2VkXG4gICAgICAgICAgZXhpc3RpbmdDb2x1bW5FdmVudC5ldmVudCA9IG9yaWdpbmFsRXZlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gYWRkIGEgZHVtbXkgZXZlbnQgdG8gdGhlIGRyb3Agc28gaWYgdGhlIGV2ZW50IHdhcyByZW1vdmVkIGZyb20gdGhlIG9yaWdpbmFsIGNvbHVtbiB0aGUgZHJhZyBkb2Vzbid0IGVuZCBlYXJseVxuICAgICAgICAgIGNvbHVtbi5ldmVudHMucHVzaCh7XG4gICAgICAgICAgICBldmVudDogb3JpZ2luYWxFdmVudCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIHN0YXJ0c0JlZm9yZURheTogZmFsc2UsXG4gICAgICAgICAgICBlbmRzQWZ0ZXJEYXk6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGFkanVzdGVkRXZlbnRzLmNsZWFyKCk7XG4gIH1cblxuICBwcml2YXRlIGdldFRpbWVFdmVudFJlc2l6ZWREYXRlcyhcbiAgICBjYWxlbmRhckV2ZW50OiBDYWxlbmRhckV2ZW50LFxuICAgIHJlc2l6ZUV2ZW50OiBSZXNpemVFdmVudFxuICApIHtcbiAgICBjb25zdCBtaW5pbXVtRXZlbnRIZWlnaHQgPSBnZXRNaW5pbXVtRXZlbnRIZWlnaHRJbk1pbnV0ZXMoXG4gICAgICB0aGlzLmhvdXJTZWdtZW50cyxcbiAgICAgIHRoaXMuaG91clNlZ21lbnRIZWlnaHRcbiAgICApO1xuICAgIGNvbnN0IG5ld0V2ZW50RGF0ZXMgPSB7XG4gICAgICBzdGFydDogY2FsZW5kYXJFdmVudC5zdGFydCxcbiAgICAgIGVuZDogZ2V0RGVmYXVsdEV2ZW50RW5kKFxuICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLFxuICAgICAgICBjYWxlbmRhckV2ZW50LFxuICAgICAgICBtaW5pbXVtRXZlbnRIZWlnaHRcbiAgICAgIClcbiAgICB9O1xuICAgIGNvbnN0IHsgZW5kLCAuLi5ldmVudFdpdGhvdXRFbmQgfSA9IGNhbGVuZGFyRXZlbnQ7XG4gICAgY29uc3Qgc21hbGxlc3RSZXNpemVzID0ge1xuICAgICAgc3RhcnQ6IHRoaXMuZGF0ZUFkYXB0ZXIuYWRkTWludXRlcyhcbiAgICAgICAgbmV3RXZlbnREYXRlcy5lbmQsXG4gICAgICAgIG1pbmltdW1FdmVudEhlaWdodCAqIC0xXG4gICAgICApLFxuICAgICAgZW5kOiBnZXREZWZhdWx0RXZlbnRFbmQoXG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgIGV2ZW50V2l0aG91dEVuZCxcbiAgICAgICAgbWluaW11bUV2ZW50SGVpZ2h0XG4gICAgICApXG4gICAgfTtcblxuICAgIGlmIChyZXNpemVFdmVudC5lZGdlcy5sZWZ0KSB7XG4gICAgICBjb25zdCBkYXlzRGlmZiA9IE1hdGgucm91bmQoXG4gICAgICAgICtyZXNpemVFdmVudC5lZGdlcy5sZWZ0IC8gdGhpcy5kYXlDb2x1bW5XaWR0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5kYXRlQWRhcHRlci5hZGREYXlzKG5ld0V2ZW50RGF0ZXMuc3RhcnQsIGRheXNEaWZmKTtcbiAgICAgIGlmIChuZXdTdGFydCA8IHNtYWxsZXN0UmVzaXplcy5zdGFydCkge1xuICAgICAgICBuZXdFdmVudERhdGVzLnN0YXJ0ID0gbmV3U3RhcnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdFdmVudERhdGVzLnN0YXJ0ID0gc21hbGxlc3RSZXNpemVzLnN0YXJ0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVzaXplRXZlbnQuZWRnZXMucmlnaHQpIHtcbiAgICAgIGNvbnN0IGRheXNEaWZmID0gTWF0aC5yb3VuZChcbiAgICAgICAgK3Jlc2l6ZUV2ZW50LmVkZ2VzLnJpZ2h0IC8gdGhpcy5kYXlDb2x1bW5XaWR0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuZGF0ZUFkYXB0ZXIuYWRkRGF5cyhuZXdFdmVudERhdGVzLmVuZCwgZGF5c0RpZmYpO1xuICAgICAgaWYgKG5ld0VuZCA+IHNtYWxsZXN0UmVzaXplcy5lbmQpIHtcbiAgICAgICAgbmV3RXZlbnREYXRlcy5lbmQgPSBuZXdFbmQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdFdmVudERhdGVzLmVuZCA9IHNtYWxsZXN0UmVzaXplcy5lbmQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc2l6ZUV2ZW50LmVkZ2VzLnRvcCkge1xuICAgICAgY29uc3QgbWludXRlc01vdmVkID0gZ2V0TWludXRlc01vdmVkKFxuICAgICAgICByZXNpemVFdmVudC5lZGdlcy50b3AgYXMgbnVtYmVyLFxuICAgICAgICB0aGlzLmhvdXJTZWdtZW50cyxcbiAgICAgICAgdGhpcy5ob3VyU2VnbWVudEhlaWdodCxcbiAgICAgICAgdGhpcy5ldmVudFNuYXBTaXplXG4gICAgICApO1xuICAgICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmRhdGVBZGFwdGVyLmFkZE1pbnV0ZXMoXG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuc3RhcnQsXG4gICAgICAgIG1pbnV0ZXNNb3ZlZFxuICAgICAgKTtcbiAgICAgIGlmIChuZXdTdGFydCA8IHNtYWxsZXN0UmVzaXplcy5zdGFydCkge1xuICAgICAgICBuZXdFdmVudERhdGVzLnN0YXJ0ID0gbmV3U3RhcnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdFdmVudERhdGVzLnN0YXJ0ID0gc21hbGxlc3RSZXNpemVzLnN0YXJ0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVzaXplRXZlbnQuZWRnZXMuYm90dG9tKSB7XG4gICAgICBjb25zdCBtaW51dGVzTW92ZWQgPSBnZXRNaW51dGVzTW92ZWQoXG4gICAgICAgIHJlc2l6ZUV2ZW50LmVkZ2VzLmJvdHRvbSBhcyBudW1iZXIsXG4gICAgICAgIHRoaXMuaG91clNlZ21lbnRzLFxuICAgICAgICB0aGlzLmhvdXJTZWdtZW50SGVpZ2h0LFxuICAgICAgICB0aGlzLmV2ZW50U25hcFNpemVcbiAgICAgICk7XG4gICAgICBjb25zdCBuZXdFbmQgPSB0aGlzLmRhdGVBZGFwdGVyLmFkZE1pbnV0ZXMoXG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuZW5kLFxuICAgICAgICBtaW51dGVzTW92ZWRcbiAgICAgICk7XG4gICAgICBpZiAobmV3RW5kID4gc21hbGxlc3RSZXNpemVzLmVuZCkge1xuICAgICAgICBuZXdFdmVudERhdGVzLmVuZCA9IG5ld0VuZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuZW5kID0gc21hbGxlc3RSZXNpemVzLmVuZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3RXZlbnREYXRlcztcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJFdmVudCwgV2Vla0RheSB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmltcG9ydCB7IHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZSB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLXdlZWstdmlldy1oZWFkZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWRheXM9XCJkYXlzXCJcbiAgICAgIGxldC1sb2NhbGU9XCJsb2NhbGVcIlxuICAgICAgbGV0LWRheUhlYWRlckNsaWNrZWQ9XCJkYXlIZWFkZXJDbGlja2VkXCJcbiAgICAgIGxldC1ldmVudERyb3BwZWQ9XCJldmVudERyb3BwZWRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjYWwtZGF5LWhlYWRlcnNcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzPVwiY2FsLWhlYWRlclwiXG4gICAgICAgICAgKm5nRm9yPVwibGV0IGRheSBvZiBkYXlzOyB0cmFja0J5OnRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZVwiXG4gICAgICAgICAgW2NsYXNzLmNhbC1wYXN0XT1cImRheS5pc1Bhc3RcIlxuICAgICAgICAgIFtjbGFzcy5jYWwtdG9kYXldPVwiZGF5LmlzVG9kYXlcIlxuICAgICAgICAgIFtjbGFzcy5jYWwtZnV0dXJlXT1cImRheS5pc0Z1dHVyZVwiXG4gICAgICAgICAgW2NsYXNzLmNhbC13ZWVrZW5kXT1cImRheS5pc1dlZWtlbmRcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cImRheS5jc3NDbGFzc1wiXG4gICAgICAgICAgKG13bENsaWNrKT1cImRheUhlYWRlckNsaWNrZWQuZW1pdCh7ZGF5OiBkYXl9KVwiXG4gICAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgICAgZHJhZ092ZXJDbGFzcz1cImNhbC1kcmFnLW92ZXJcIlxuICAgICAgICAgIChkcm9wKT1cImV2ZW50RHJvcHBlZC5lbWl0KHtldmVudDogJGV2ZW50LmRyb3BEYXRhLmV2ZW50LCBuZXdTdGFydDogZGF5LmRhdGV9KVwiPlxuICAgICAgICAgIDxiPnt7IGRheS5kYXRlIHwgY2FsZW5kYXJEYXRlOid3ZWVrVmlld0NvbHVtbkhlYWRlcic6bG9jYWxlIH19PC9iPjxicj5cbiAgICAgICAgICA8c3Bhbj57eyBkYXkuZGF0ZSB8IGNhbGVuZGFyRGF0ZTond2Vla1ZpZXdDb2x1bW5TdWJIZWFkZXInOmxvY2FsZSB9fTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGF5czogZGF5cywgbG9jYWxlOiBsb2NhbGUsIGRheUhlYWRlckNsaWNrZWQ6IGRheUhlYWRlckNsaWNrZWQsIGV2ZW50RHJvcHBlZDogZXZlbnREcm9wcGVkfVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJXZWVrVmlld0hlYWRlckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIGRheXM6IFdlZWtEYXlbXTtcblxuICBASW5wdXQoKVxuICBsb2NhbGU6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAT3V0cHV0KClcbiAgZGF5SGVhZGVyQ2xpY2tlZDogRXZlbnRFbWl0dGVyPHsgZGF5OiBXZWVrRGF5IH0+ID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgZGF5OiBXZWVrRGF5O1xuICB9PigpO1xuXG4gIEBPdXRwdXQoKVxuICBldmVudERyb3BwZWQ6IEV2ZW50RW1pdHRlcjx7XG4gICAgZXZlbnQ6IENhbGVuZGFyRXZlbnQ7XG4gICAgbmV3U3RhcnQ6IERhdGU7XG4gIH0+ID0gbmV3IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBDYWxlbmRhckV2ZW50OyBuZXdTdGFydDogRGF0ZSB9PigpO1xuXG4gIHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZSA9IHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZTtcbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFdlZWtWaWV3QWxsRGF5RXZlbnQsIERheVZpZXdFdmVudCB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmltcG9ydCB7IFBsYWNlbWVudEFycmF5IH0gZnJvbSAncG9zaXRpb25pbmcnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICNkZWZhdWx0VGVtcGxhdGVcbiAgICAgIGxldC13ZWVrRXZlbnQ9XCJ3ZWVrRXZlbnRcIlxuICAgICAgbGV0LXRvb2x0aXBQbGFjZW1lbnQ9XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgIGxldC1ldmVudENsaWNrZWQ9XCJldmVudENsaWNrZWRcIlxuICAgICAgbGV0LXRvb2x0aXBUZW1wbGF0ZT1cInRvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICBsZXQtdG9vbHRpcEFwcGVuZFRvQm9keT1cInRvb2x0aXBBcHBlbmRUb0JvZHlcIlxuICAgICAgbGV0LXRvb2x0aXBEaXNhYmxlZD1cInRvb2x0aXBEaXNhYmxlZFwiPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImNhbC1ldmVudFwiXG4gICAgICAgIFtzdHlsZS5iYWNrZ3JvdW5kQ29sb3JdPVwid2Vla0V2ZW50LmV2ZW50LmNvbG9yPy5zZWNvbmRhcnlcIlxuICAgICAgICBbc3R5bGUuYm9yZGVyQ29sb3JdPVwid2Vla0V2ZW50LmV2ZW50LmNvbG9yPy5wcmltYXJ5XCJcbiAgICAgICAgW213bENhbGVuZGFyVG9vbHRpcF09XCIhdG9vbHRpcERpc2FibGVkID8gKHdlZWtFdmVudC5ldmVudC50aXRsZSB8IGNhbGVuZGFyRXZlbnRUaXRsZTond2Vla1Rvb2x0aXAnOndlZWtFdmVudC5ldmVudCkgOiAnJ1wiXG4gICAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cInRvb2x0aXBQbGFjZW1lbnRcIlxuICAgICAgICBbdG9vbHRpcEV2ZW50XT1cIndlZWtFdmVudC5ldmVudFwiXG4gICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgW3Rvb2x0aXBBcHBlbmRUb0JvZHldPVwidG9vbHRpcEFwcGVuZFRvQm9keVwiXG4gICAgICAgIChtd2xDbGljayk9XCJldmVudENsaWNrZWQuZW1pdCgpXCI+XG4gICAgICAgIDxtd2wtY2FsZW5kYXItZXZlbnQtYWN0aW9uc1xuICAgICAgICAgIFtldmVudF09XCJ3ZWVrRXZlbnQuZXZlbnRcIlxuICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJldmVudEFjdGlvbnNUZW1wbGF0ZVwiPlxuICAgICAgICA8L213bC1jYWxlbmRhci1ldmVudC1hY3Rpb25zPlxuICAgICAgICAmbmdzcDtcbiAgICAgICAgPG13bC1jYWxlbmRhci1ldmVudC10aXRsZVxuICAgICAgICAgIFtldmVudF09XCJ3ZWVrRXZlbnQuZXZlbnRcIlxuICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJldmVudFRpdGxlVGVtcGxhdGVcIlxuICAgICAgICAgIHZpZXc9XCJ3ZWVrXCI+XG4gICAgICAgIDwvbXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICB3ZWVrRXZlbnQ6IHdlZWtFdmVudCxcbiAgICAgICAgdG9vbHRpcFBsYWNlbWVudDogdG9vbHRpcFBsYWNlbWVudCxcbiAgICAgICAgZXZlbnRDbGlja2VkOiBldmVudENsaWNrZWQsXG4gICAgICAgIHRvb2x0aXBUZW1wbGF0ZTogdG9vbHRpcFRlbXBsYXRlLFxuICAgICAgICB0b29sdGlwQXBwZW5kVG9Cb2R5OiB0b29sdGlwQXBwZW5kVG9Cb2R5LFxuICAgICAgICB0b29sdGlwRGlzYWJsZWQ6IHRvb2x0aXBEaXNhYmxlZFxuICAgICAgfVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJXZWVrVmlld0V2ZW50Q29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgd2Vla0V2ZW50OiBXZWVrVmlld0FsbERheUV2ZW50IHwgRGF5Vmlld0V2ZW50O1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBQbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBBcHBlbmRUb0JvZHk6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcERpc2FibGVkOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpXG4gIGV2ZW50VGl0bGVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKVxuICBldmVudEFjdGlvbnNUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQE91dHB1dCgpXG4gIGV2ZW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgV2Vla1ZpZXdIb3VyQ29sdW1uIH0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItd2Vlay12aWV3LWhvdXItc2VnbWVudCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAjZGVmYXVsdFRlbXBsYXRlXG4gICAgICBsZXQtc2VnbWVudD1cInNlZ21lbnRcIlxuICAgICAgbGV0LWxvY2FsZT1cImxvY2FsZVwiXG4gICAgICBsZXQtc2VnbWVudEhlaWdodD1cInNlZ21lbnRIZWlnaHRcIlxuICAgICAgbGV0LWlzVGltZUxhYmVsPVwiaXNUaW1lTGFiZWxcIj5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJjYWwtaG91ci1zZWdtZW50XCJcbiAgICAgICAgW3N0eWxlLmhlaWdodC5weF09XCJzZWdtZW50SGVpZ2h0XCJcbiAgICAgICAgW2NsYXNzLmNhbC1ob3VyLXN0YXJ0XT1cInNlZ21lbnQuaXNTdGFydFwiXG4gICAgICAgIFtjbGFzcy5jYWwtYWZ0ZXItaG91ci1zdGFydF09XCIhc2VnbWVudC5pc1N0YXJ0XCJcbiAgICAgICAgW25nQ2xhc3NdPVwic2VnbWVudC5jc3NDbGFzc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXRpbWVcIiAqbmdJZj1cImlzVGltZUxhYmVsXCI+XG4gICAgICAgICAge3sgc2VnbWVudC5kYXRlIHwgY2FsZW5kYXJEYXRlOid3ZWVrVmlld0hvdXInOmxvY2FsZSB9fVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgc2VnbWVudDogc2VnbWVudCxcbiAgICAgICAgbG9jYWxlOiBsb2NhbGUsXG4gICAgICAgIHNlZ21lbnRIZWlnaHQ6IHNlZ21lbnRIZWlnaHQsXG4gICAgICAgIGlzVGltZUxhYmVsOiBpc1RpbWVMYWJlbFxuICAgICAgfVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJXZWVrVmlld0hvdXJTZWdtZW50Q29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgc2VnbWVudDogV2Vla1ZpZXdIb3VyQ29sdW1uO1xuXG4gIEBJbnB1dCgpXG4gIHNlZ21lbnRIZWlnaHQ6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBsb2NhbGU6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBpc1RpbWVMYWJlbDogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pjtcbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUmVzaXphYmxlTW9kdWxlIH0gZnJvbSAnYW5ndWxhci1yZXNpemFibGUtZWxlbWVudCc7XG5pbXBvcnQgeyBEcmFnQW5kRHJvcE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZSc7XG5pbXBvcnQgeyBDYWxlbmRhcldlZWtWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci13ZWVrLXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXdlZWstdmlldy1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdFdmVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckNvbW1vbk1vZHVsZSB9IGZyb20gJy4uL2NvbW1vbi9jYWxlbmRhci1jb21tb24ubW9kdWxlJztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdIb3VyU2VnbWVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LWhvdXItc2VnbWVudC5jb21wb25lbnQnO1xuXG5leHBvcnQge1xuICBDYWxlbmRhcldlZWtWaWV3Q29tcG9uZW50LFxuICBDYWxlbmRhcldlZWtWaWV3QmVmb3JlUmVuZGVyRXZlbnRcbn0gZnJvbSAnLi9jYWxlbmRhci13ZWVrLXZpZXcuY29tcG9uZW50JztcbmV4cG9ydCB7XG4gIFdlZWtWaWV3QWxsRGF5RXZlbnQgYXMgQ2FsZW5kYXJXZWVrVmlld0FsbERheUV2ZW50LFxuICBXZWVrVmlld0FsbERheUV2ZW50Um93IGFzIENhbGVuZGFyV2Vla1ZpZXdBbGxEYXlFdmVudFJvdyxcbiAgR2V0V2Vla1ZpZXdBcmdzIGFzIENhbGVuZGFyR2V0V2Vla1ZpZXdBcmdzXG59IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmV4cG9ydCB7IGdldFdlZWtWaWV3UGVyaW9kIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIFJlc2l6YWJsZU1vZHVsZSxcbiAgICBEcmFnQW5kRHJvcE1vZHVsZSxcbiAgICBDYWxlbmRhckNvbW1vbk1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBDYWxlbmRhcldlZWtWaWV3Q29tcG9uZW50LFxuICAgIENhbGVuZGFyV2Vla1ZpZXdIZWFkZXJDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0V2ZW50Q29tcG9uZW50LFxuICAgIENhbGVuZGFyV2Vla1ZpZXdIb3VyU2VnbWVudENvbXBvbmVudFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgUmVzaXphYmxlTW9kdWxlLFxuICAgIERyYWdBbmREcm9wTW9kdWxlLFxuICAgIENhbGVuZGFyV2Vla1ZpZXdDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0hlYWRlckNvbXBvbmVudCxcbiAgICBDYWxlbmRhcldlZWtWaWV3RXZlbnRDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0hvdXJTZWdtZW50Q29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJXZWVrTW9kdWxlIHt9XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgTE9DQUxFX0lELFxuICBJbmplY3QsXG4gIE9uSW5pdCxcbiAgT25EZXN0cm95LFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbGVuZGFyRXZlbnQsXG4gIERheVZpZXcsXG4gIERheVZpZXdIb3VyLFxuICBEYXlWaWV3SG91clNlZ21lbnQsXG4gIERheVZpZXdFdmVudCxcbiAgVmlld1BlcmlvZCxcbiAgV2Vla1ZpZXdBbGxEYXlFdmVudFxufSBmcm9tICdjYWxlbmRhci11dGlscyc7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFJlc2l6ZUV2ZW50IH0gZnJvbSAnYW5ndWxhci1yZXNpemFibGUtZWxlbWVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckRyYWdIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItZHJhZy1oZWxwZXIucHJvdmlkZXInO1xuaW1wb3J0IHsgQ2FsZW5kYXJSZXNpemVIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItcmVzaXplLWhlbHBlci5wcm92aWRlcic7XG5pbXBvcnQge1xuICBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnQsXG4gIENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFR5cGVcbn0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLWV2ZW50LXRpbWVzLWNoYW5nZWQtZXZlbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IENhbGVuZGFyVXRpbHMgfSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItdXRpbHMucHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgdmFsaWRhdGVFdmVudHMsXG4gIHRyYWNrQnlFdmVudElkLFxuICB0cmFja0J5SG91cixcbiAgdHJhY2tCeUhvdXJTZWdtZW50LFxuICBnZXRNaW51dGVzTW92ZWQsXG4gIGdldERlZmF1bHRFdmVudEVuZCxcbiAgZ2V0TWluaW11bUV2ZW50SGVpZ2h0SW5NaW51dGVzLFxuICB0cmFja0J5RGF5T3JXZWVrRXZlbnQsXG4gIGlzRHJhZ2dlZFdpdGhpblBlcmlvZCxcbiAgc2hvdWxkRmlyZURyb3BwZWRFdmVudFxufSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7IERyYWdFbmRFdmVudCB9IGZyb20gJ2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZSc7XG5pbXBvcnQgeyBQbGFjZW1lbnRBcnJheSB9IGZyb20gJ3Bvc2l0aW9uaW5nJztcblxuZXhwb3J0IGludGVyZmFjZSBDYWxlbmRhckRheVZpZXdCZWZvcmVSZW5kZXJFdmVudCB7XG4gIGJvZHk6IHtcbiAgICBob3VyR3JpZDogRGF5Vmlld0hvdXJbXTtcbiAgICBhbGxEYXlFdmVudHM6IENhbGVuZGFyRXZlbnRbXTtcbiAgfTtcbiAgcGVyaW9kOiBWaWV3UGVyaW9kO1xufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEYXlWaWV3RXZlbnRSZXNpemUge1xuICBvcmlnaW5hbFRvcDogbnVtYmVyO1xuICBvcmlnaW5hbEhlaWdodDogbnVtYmVyO1xuICBlZGdlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogU2hvd3MgYWxsIGV2ZW50cyBvbiBhIGdpdmVuIGRheS4gRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiA8bXdsLWNhbGVuZGFyLWRheS12aWV3XG4gKiAgW3ZpZXdEYXRlXT1cInZpZXdEYXRlXCJcbiAqICBbZXZlbnRzXT1cImV2ZW50c1wiPlxuICogPC9td2wtY2FsZW5kYXItZGF5LXZpZXc+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLWRheS12aWV3JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiY2FsLWRheS12aWV3XCI+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiY2FsLWFsbC1kYXktZXZlbnRzXCJcbiAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgIGRyYWdPdmVyQ2xhc3M9XCJjYWwtZHJhZy1vdmVyXCJcbiAgICAgICAgZHJhZ0FjdGl2ZUNsYXNzPVwiY2FsLWRyYWctYWN0aXZlXCJcbiAgICAgICAgKGRyb3ApPVwiZXZlbnREcm9wcGVkKCRldmVudCwgdmlldy5wZXJpb2Quc3RhcnQsIHRydWUpXCI+XG4gICAgICAgIDxtd2wtY2FsZW5kYXItZGF5LXZpZXctZXZlbnRcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgZXZlbnQgb2Ygdmlldy5hbGxEYXlFdmVudHM7IHRyYWNrQnk6dHJhY2tCeUV2ZW50SWRcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cImV2ZW50LmNzc0NsYXNzXCJcbiAgICAgICAgICBbZGF5RXZlbnRdPVwie2V2ZW50OiBldmVudH1cIlxuICAgICAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cInRvb2x0aXBQbGFjZW1lbnRcIlxuICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgICBbdG9vbHRpcEFwcGVuZFRvQm9keV09XCJ0b29sdGlwQXBwZW5kVG9Cb2R5XCJcbiAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgW2V2ZW50VGl0bGVUZW1wbGF0ZV09XCJldmVudFRpdGxlVGVtcGxhdGVcIlxuICAgICAgICAgIFtldmVudEFjdGlvbnNUZW1wbGF0ZV09XCJldmVudEFjdGlvbnNUZW1wbGF0ZVwiXG4gICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6IGV2ZW50fSlcIlxuICAgICAgICAgIFtjbGFzcy5jYWwtZHJhZ2dhYmxlXT1cIiFzbmFwRHJhZ2dlZEV2ZW50cyAmJiBldmVudC5kcmFnZ2FibGVcIlxuICAgICAgICAgIG13bERyYWdnYWJsZVxuICAgICAgICAgIGRyYWdBY3RpdmVDbGFzcz1cImNhbC1kcmFnLWFjdGl2ZVwiXG4gICAgICAgICAgW2Ryb3BEYXRhXT1cIntldmVudDogZXZlbnQsIGNhbGVuZGFySWQ6IGNhbGVuZGFySWR9XCJcbiAgICAgICAgICBbZHJhZ0F4aXNdPVwie3g6ICFzbmFwRHJhZ2dlZEV2ZW50cyAmJiBldmVudC5kcmFnZ2FibGUsIHk6ICFzbmFwRHJhZ2dlZEV2ZW50cyAmJiBldmVudC5kcmFnZ2FibGV9XCI+XG4gICAgICAgIDwvbXdsLWNhbGVuZGFyLWRheS12aWV3LWV2ZW50PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiY2FsLWhvdXItcm93c1wiXG4gICAgICAgICNkYXlFdmVudHNDb250YWluZXJcbiAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgIChkcmFnRW50ZXIpPVwiZXZlbnREcmFnRW50ZXIgPSBldmVudERyYWdFbnRlciArIDFcIlxuICAgICAgICAoZHJhZ0xlYXZlKT1cImV2ZW50RHJhZ0VudGVyID0gZXZlbnREcmFnRW50ZXIgLSAxXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtZXZlbnRzXCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgI2V2ZW50XG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgZGF5RXZlbnQgb2Ygdmlldz8uZXZlbnRzOyB0cmFja0J5OnRyYWNrQnlEYXlFdmVudFwiXG4gICAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1jb250YWluZXJcIlxuICAgICAgICAgICAgW2NsYXNzLmNhbC1kcmFnZ2FibGVdPVwiZGF5RXZlbnQuZXZlbnQuZHJhZ2dhYmxlXCJcbiAgICAgICAgICAgIFtjbGFzcy5jYWwtc3RhcnRzLXdpdGhpbi1kYXldPVwiIWRheUV2ZW50LnN0YXJ0c0JlZm9yZURheVwiXG4gICAgICAgICAgICBbY2xhc3MuY2FsLWVuZHMtd2l0aGluLWRheV09XCIhZGF5RXZlbnQuZW5kc0FmdGVyRGF5XCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cImRheUV2ZW50LmV2ZW50LmNzc0NsYXNzXCJcbiAgICAgICAgICAgIG13bFJlc2l6YWJsZVxuICAgICAgICAgICAgW3Jlc2l6ZVNuYXBHcmlkXT1cInt0b3A6IGV2ZW50U25hcFNpemUgfHwgaG91clNlZ21lbnRIZWlnaHQsIGJvdHRvbTogZXZlbnRTbmFwU2l6ZSB8fCBob3VyU2VnbWVudEhlaWdodH1cIlxuICAgICAgICAgICAgW3ZhbGlkYXRlUmVzaXplXT1cInZhbGlkYXRlUmVzaXplXCJcbiAgICAgICAgICAgIChyZXNpemVTdGFydCk9XCJyZXNpemVTdGFydGVkKGRheUV2ZW50LCAkZXZlbnQsIGRheUV2ZW50c0NvbnRhaW5lcilcIlxuICAgICAgICAgICAgKHJlc2l6aW5nKT1cInJlc2l6aW5nKGRheUV2ZW50LCAkZXZlbnQpXCJcbiAgICAgICAgICAgIChyZXNpemVFbmQpPVwicmVzaXplRW5kZWQoZGF5RXZlbnQpXCJcbiAgICAgICAgICAgIG13bERyYWdnYWJsZVxuICAgICAgICAgICAgZHJhZ0FjdGl2ZUNsYXNzPVwiY2FsLWRyYWctYWN0aXZlXCJcbiAgICAgICAgICAgIFtkcm9wRGF0YV09XCJ7ZXZlbnQ6IGRheUV2ZW50LmV2ZW50LCBjYWxlbmRhcklkOiBjYWxlbmRhcklkfVwiXG4gICAgICAgICAgICBbZHJhZ0F4aXNdPVwie3g6ICFzbmFwRHJhZ2dlZEV2ZW50cyAmJiBkYXlFdmVudC5ldmVudC5kcmFnZ2FibGUgJiYgY3VycmVudFJlc2l6ZXMuc2l6ZSA9PT0gMCwgeTogZGF5RXZlbnQuZXZlbnQuZHJhZ2dhYmxlICYmIGN1cnJlbnRSZXNpemVzLnNpemUgPT09IDB9XCJcbiAgICAgICAgICAgIFtkcmFnU25hcEdyaWRdPVwic25hcERyYWdnZWRFdmVudHMgPyB7eTogZXZlbnRTbmFwU2l6ZSB8fCBob3VyU2VnbWVudEhlaWdodH0gOiB7fVwiXG4gICAgICAgICAgICBbdmFsaWRhdGVEcmFnXT1cInZhbGlkYXRlRHJhZ1wiXG4gICAgICAgICAgICAoZHJhZ1BvaW50ZXJEb3duKT1cImRyYWdTdGFydGVkKGV2ZW50LCBkYXlFdmVudHNDb250YWluZXIpXCJcbiAgICAgICAgICAgIChkcmFnRW5kKT1cImRyYWdFbmRlZChkYXlFdmVudCwgJGV2ZW50KVwiXG4gICAgICAgICAgICBbc3R5bGUubWFyZ2luVG9wLnB4XT1cImRheUV2ZW50LnRvcFwiXG4gICAgICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cImRheUV2ZW50LmhlaWdodFwiXG4gICAgICAgICAgICBbc3R5bGUubWFyZ2luTGVmdC5weF09XCJkYXlFdmVudC5sZWZ0ICsgNzBcIlxuICAgICAgICAgICAgW3N0eWxlLndpZHRoLnB4XT1cImRheUV2ZW50LndpZHRoIC0gMVwiPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzcz1cImNhbC1yZXNpemUtaGFuZGxlIGNhbC1yZXNpemUtaGFuZGxlLWJlZm9yZS1zdGFydFwiXG4gICAgICAgICAgICAgICpuZ0lmPVwiZGF5RXZlbnQuZXZlbnQ/LnJlc2l6YWJsZT8uYmVmb3JlU3RhcnQgJiYgIWRheUV2ZW50LnN0YXJ0c0JlZm9yZURheVwiXG4gICAgICAgICAgICAgIG13bFJlc2l6ZUhhbmRsZVxuICAgICAgICAgICAgICBbcmVzaXplRWRnZXNdPVwieyB0b3A6IHRydWUgfVwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8bXdsLWNhbGVuZGFyLWRheS12aWV3LWV2ZW50XG4gICAgICAgICAgICAgIFtkYXlFdmVudF09XCJkYXlFdmVudFwiXG4gICAgICAgICAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cInRvb2x0aXBQbGFjZW1lbnRcIlxuICAgICAgICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFt0b29sdGlwQXBwZW5kVG9Cb2R5XT1cInRvb2x0aXBBcHBlbmRUb0JvZHlcIlxuICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFtldmVudFRpdGxlVGVtcGxhdGVdPVwiZXZlbnRUaXRsZVRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgW2V2ZW50QWN0aW9uc1RlbXBsYXRlXT1cImV2ZW50QWN0aW9uc1RlbXBsYXRlXCJcbiAgICAgICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6IGRheUV2ZW50LmV2ZW50fSlcIj5cbiAgICAgICAgICAgIDwvbXdsLWNhbGVuZGFyLWRheS12aWV3LWV2ZW50PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzcz1cImNhbC1yZXNpemUtaGFuZGxlIGNhbC1yZXNpemUtaGFuZGxlLWFmdGVyLWVuZFwiXG4gICAgICAgICAgICAgICpuZ0lmPVwiZGF5RXZlbnQuZXZlbnQ/LnJlc2l6YWJsZT8uYWZ0ZXJFbmQgJiYgIWRheUV2ZW50LmVuZHNBZnRlckRheVwiXG4gICAgICAgICAgICAgIG13bFJlc2l6ZUhhbmRsZVxuICAgICAgICAgICAgICBbcmVzaXplRWRnZXNdPVwieyBib3R0b206IHRydWUgfVwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLWhvdXJcIiAqbmdGb3I9XCJsZXQgaG91ciBvZiBob3VyczsgdHJhY2tCeTp0cmFja0J5SG91clwiIFtzdHlsZS5taW5XaWR0aC5weF09XCJ2aWV3Py53aWR0aCArIDcwXCI+XG4gICAgICAgICAgPG13bC1jYWxlbmRhci1kYXktdmlldy1ob3VyLXNlZ21lbnRcbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBzZWdtZW50IG9mIGhvdXIuc2VnbWVudHM7IHRyYWNrQnk6dHJhY2tCeUhvdXJTZWdtZW50XCJcbiAgICAgICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgW3NlZ21lbnRdPVwic2VnbWVudFwiXG4gICAgICAgICAgICBbc2VnbWVudEhlaWdodF09XCJob3VyU2VnbWVudEhlaWdodFwiXG4gICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiaG91clNlZ21lbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAobXdsQ2xpY2spPVwiaG91clNlZ21lbnRDbGlja2VkLmVtaXQoe2RhdGU6IHNlZ21lbnQuZGF0ZX0pXCJcbiAgICAgICAgICAgIG13bERyb3BwYWJsZVxuICAgICAgICAgICAgZHJhZ092ZXJDbGFzcz1cImNhbC1kcmFnLW92ZXJcIlxuICAgICAgICAgICAgZHJhZ0FjdGl2ZUNsYXNzPVwiY2FsLWRyYWctYWN0aXZlXCJcbiAgICAgICAgICAgIChkcm9wKT1cImV2ZW50RHJvcHBlZCgkZXZlbnQsIHNlZ21lbnQuZGF0ZSwgZmFsc2UpXCI+XG4gICAgICAgICAgPC9td2wtY2FsZW5kYXItZGF5LXZpZXctaG91ci1zZWdtZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyRGF5Vmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmlldyBkYXRlXG4gICAqL1xuICBASW5wdXQoKVxuICB2aWV3RGF0ZTogRGF0ZTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXZlbnRzIHRvIGRpc3BsYXkgb24gdmlld1xuICAgKiBUaGUgc2NoZW1hIGlzIGF2YWlsYWJsZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vbWF0dGxld2lzOTIvY2FsZW5kYXItdXRpbHMvYmxvYi9jNTE2ODk5ODVmNTlhMjcxOTQwZTMwYmM0ZTJjNGUxZmVlM2ZjYjVjL3NyYy9jYWxlbmRhclV0aWxzLnRzI0w0OS1MNjNcbiAgICovXG4gIEBJbnB1dCgpXG4gIGV2ZW50czogQ2FsZW5kYXJFdmVudFtdID0gW107XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2Ygc2VnbWVudHMgaW4gYW4gaG91ci4gTXVzdCBiZSA8PSA2XG4gICAqL1xuICBASW5wdXQoKVxuICBob3VyU2VnbWVudHM6IG51bWJlciA9IDI7XG5cbiAgLyoqXG4gICAqIFRoZSBoZWlnaHQgaW4gcGl4ZWxzIG9mIGVhY2ggaG91ciBzZWdtZW50XG4gICAqL1xuICBASW5wdXQoKVxuICBob3VyU2VnbWVudEhlaWdodDogbnVtYmVyID0gMzA7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgc3RhcnQgaG91cnMgaW4gMjQgaG91ciB0aW1lLiBNdXN0IGJlIDAtMjNcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRheVN0YXJ0SG91cjogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogVGhlIGRheSBzdGFydCBtaW51dGVzLiBNdXN0IGJlIDAtNTlcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRheVN0YXJ0TWludXRlOiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IGVuZCBob3VycyBpbiAyNCBob3VyIHRpbWUuIE11c3QgYmUgMC0yM1xuICAgKi9cbiAgQElucHV0KClcbiAgZGF5RW5kSG91cjogbnVtYmVyID0gMjM7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgZW5kIG1pbnV0ZXMuIE11c3QgYmUgMC01OVxuICAgKi9cbiAgQElucHV0KClcbiAgZGF5RW5kTWludXRlOiBudW1iZXIgPSA1OTtcblxuICAvKipcbiAgICogVGhlIHdpZHRoIGluIHBpeGVscyBvZiBlYWNoIGV2ZW50IG9uIHRoZSB2aWV3XG4gICAqL1xuICBASW5wdXQoKVxuICBldmVudFdpZHRoOiBudW1iZXIgPSAxNTA7XG5cbiAgLyoqXG4gICAqIEFuIG9ic2VydmFibGUgdGhhdCB3aGVuIGVtaXR0ZWQgb24gd2lsbCByZS1yZW5kZXIgdGhlIGN1cnJlbnQgdmlld1xuICAgKi9cbiAgQElucHV0KClcbiAgcmVmcmVzaDogU3ViamVjdDxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgbG9jYWxlIHVzZWQgdG8gZm9ybWF0IGRhdGVzXG4gICAqL1xuICBASW5wdXQoKVxuICBsb2NhbGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGdyaWQgc2l6ZSB0byBzbmFwIHJlc2l6aW5nIGFuZCBkcmFnZ2luZyBvZiBldmVudHMgdG9cbiAgICovXG4gIEBJbnB1dCgpXG4gIGV2ZW50U25hcFNpemU6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHBsYWNlbWVudCBvZiB0aGUgZXZlbnQgdG9vbHRpcFxuICAgKi9cbiAgQElucHV0KClcbiAgdG9vbHRpcFBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAnYXV0byc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgdGhlIGV2ZW50IHRvb2x0aXBzXG4gICAqL1xuICBASW5wdXQoKVxuICB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXBwZW5kIHRvb2x0aXBzIHRvIHRoZSBib2R5IG9yIG5leHQgdG8gdGhlIHRyaWdnZXIgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KClcbiAgdG9vbHRpcEFwcGVuZFRvQm9keTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBob3VyIHNlZ21lbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGhvdXJTZWdtZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgZGF5IHZpZXcgZXZlbnRzXG4gICAqL1xuICBASW5wdXQoKVxuICBldmVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IHRpdGxlc1xuICAgKi9cbiAgQElucHV0KClcbiAgZXZlbnRUaXRsZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IGFjdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpXG4gIGV2ZW50QWN0aW9uc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHNuYXAgZXZlbnRzIHRvIGEgZ3JpZCB3aGVuIGRyYWdnaW5nXG4gICAqL1xuICBASW5wdXQoKVxuICBzbmFwRHJhZ2dlZEV2ZW50czogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGFuIGV2ZW50IHRpdGxlIGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBldmVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBldmVudDogQ2FsZW5kYXJFdmVudDtcbiAgfT4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYW4gaG91ciBzZWdtZW50IGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBob3VyU2VnbWVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBkYXRlOiBEYXRlO1xuICB9PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhbiBldmVudCBpcyByZXNpemVkIG9yIGRyYWdnZWQgYW5kIGRyb3BwZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBldmVudFRpbWVzQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBBbiBvdXRwdXQgdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHZpZXcgaXMgcmVuZGVyZWQgZm9yIHRoZSBjdXJyZW50IGRheS5cbiAgICogSWYgeW91IGFkZCB0aGUgYGNzc0NsYXNzYCBwcm9wZXJ0eSB0byBhbiBob3VyIGdyaWQgc2VnbWVudCBpdCB3aWxsIGFkZCB0aGF0IGNsYXNzIHRvIHRoZSBob3VyIHNlZ21lbnQgaW4gdGhlIHRlbXBsYXRlXG4gICAqL1xuICBAT3V0cHV0KClcbiAgYmVmb3JlVmlld1JlbmRlciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2FsZW5kYXJEYXlWaWV3QmVmb3JlUmVuZGVyRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGhvdXJzOiBEYXlWaWV3SG91cltdID0gW107XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHZpZXc6IERheVZpZXc7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHdpZHRoOiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICByZWZyZXNoU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGN1cnJlbnRSZXNpemVzOiBNYXA8RGF5Vmlld0V2ZW50LCBEYXlWaWV3RXZlbnRSZXNpemU+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBldmVudERyYWdFbnRlciA9IDA7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGNhbGVuZGFySWQgPSBTeW1ib2woJ2FuZ3VsYXIgY2FsZW5kYXIgZGF5IHZpZXcgaWQnKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdmFsaWRhdGVEcmFnOiAoYXJnczogYW55KSA9PiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB2YWxpZGF0ZVJlc2l6ZTogKGFyZ3M6IGFueSkgPT4gYm9vbGVhbjtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdHJhY2tCeUV2ZW50SWQgPSB0cmFja0J5RXZlbnRJZDtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdHJhY2tCeUhvdXIgPSB0cmFja0J5SG91cjtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdHJhY2tCeUhvdXJTZWdtZW50ID0gdHJhY2tCeUhvdXJTZWdtZW50O1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5RGF5RXZlbnQgPSB0cmFja0J5RGF5T3JXZWVrRXZlbnQ7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHV0aWxzOiBDYWxlbmRhclV0aWxzLFxuICAgIEBJbmplY3QoTE9DQUxFX0lEKSBsb2NhbGU6IHN0cmluZyxcbiAgICBwcml2YXRlIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlclxuICApIHtcbiAgICB0aGlzLmxvY2FsZSA9IGxvY2FsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZWZyZXNoKSB7XG4gICAgICB0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24gPSB0aGlzLnJlZnJlc2guc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5yZWZyZXNoQWxsKCk7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucmVmcmVzaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBjaGFuZ2VzLnZpZXdEYXRlIHx8XG4gICAgICBjaGFuZ2VzLmRheVN0YXJ0SG91ciB8fFxuICAgICAgY2hhbmdlcy5kYXlTdGFydE1pbnV0ZSB8fFxuICAgICAgY2hhbmdlcy5kYXlFbmRIb3VyIHx8XG4gICAgICBjaGFuZ2VzLmRheUVuZE1pbnV0ZSB8fFxuICAgICAgY2hhbmdlcy5ob3VyU2VnbWVudHNcbiAgICApIHtcbiAgICAgIHRoaXMucmVmcmVzaEhvdXJHcmlkKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuZXZlbnRzKSB7XG4gICAgICB2YWxpZGF0ZUV2ZW50cyh0aGlzLmV2ZW50cyk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgY2hhbmdlcy52aWV3RGF0ZSB8fFxuICAgICAgY2hhbmdlcy5ldmVudHMgfHxcbiAgICAgIGNoYW5nZXMuZGF5U3RhcnRIb3VyIHx8XG4gICAgICBjaGFuZ2VzLmRheVN0YXJ0TWludXRlIHx8XG4gICAgICBjaGFuZ2VzLmRheUVuZEhvdXIgfHxcbiAgICAgIGNoYW5nZXMuZGF5RW5kTWludXRlIHx8XG4gICAgICBjaGFuZ2VzLmV2ZW50V2lkdGhcbiAgICApIHtcbiAgICAgIHRoaXMucmVmcmVzaFZpZXcoKTtcbiAgICB9XG4gIH1cblxuICBldmVudERyb3BwZWQoXG4gICAgZHJvcEV2ZW50OiB7IGRyb3BEYXRhPzogeyBldmVudD86IENhbGVuZGFyRXZlbnQ7IGNhbGVuZGFySWQ/OiBzeW1ib2wgfSB9LFxuICAgIGRhdGU6IERhdGUsXG4gICAgYWxsRGF5OiBib29sZWFuXG4gICk6IHZvaWQge1xuICAgIGlmIChzaG91bGRGaXJlRHJvcHBlZEV2ZW50KGRyb3BFdmVudCwgZGF0ZSwgYWxsRGF5LCB0aGlzLmNhbGVuZGFySWQpKSB7XG4gICAgICB0aGlzLmV2ZW50VGltZXNDaGFuZ2VkLmVtaXQoe1xuICAgICAgICB0eXBlOiBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLkRyb3AsXG4gICAgICAgIGV2ZW50OiBkcm9wRXZlbnQuZHJvcERhdGEuZXZlbnQsXG4gICAgICAgIG5ld1N0YXJ0OiBkYXRlLFxuICAgICAgICBhbGxEYXlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlc2l6ZVN0YXJ0ZWQoXG4gICAgZXZlbnQ6IERheVZpZXdFdmVudCxcbiAgICByZXNpemVFdmVudDogUmVzaXplRXZlbnQsXG4gICAgZGF5RXZlbnRzQ29udGFpbmVyOiBIVE1MRWxlbWVudFxuICApOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRSZXNpemVzLnNldChldmVudCwge1xuICAgICAgb3JpZ2luYWxUb3A6IGV2ZW50LnRvcCxcbiAgICAgIG9yaWdpbmFsSGVpZ2h0OiBldmVudC5oZWlnaHQsXG4gICAgICBlZGdlOiB0eXBlb2YgcmVzaXplRXZlbnQuZWRnZXMudG9wICE9PSAndW5kZWZpbmVkJyA/ICd0b3AnIDogJ2JvdHRvbSdcbiAgICB9KTtcbiAgICBjb25zdCByZXNpemVIZWxwZXI6IENhbGVuZGFyUmVzaXplSGVscGVyID0gbmV3IENhbGVuZGFyUmVzaXplSGVscGVyKFxuICAgICAgZGF5RXZlbnRzQ29udGFpbmVyXG4gICAgKTtcbiAgICB0aGlzLnZhbGlkYXRlUmVzaXplID0gKHsgcmVjdGFuZ2xlIH0pID0+XG4gICAgICByZXNpemVIZWxwZXIudmFsaWRhdGVSZXNpemUoeyByZWN0YW5nbGUgfSk7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZXNpemluZyhldmVudDogRGF5Vmlld0V2ZW50LCByZXNpemVFdmVudDogUmVzaXplRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50UmVzaXplOiBEYXlWaWV3RXZlbnRSZXNpemUgPSB0aGlzLmN1cnJlbnRSZXNpemVzLmdldChldmVudCk7XG4gICAgaWYgKHJlc2l6ZUV2ZW50LmVkZ2VzLnRvcCkge1xuICAgICAgZXZlbnQudG9wID0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbFRvcCArICtyZXNpemVFdmVudC5lZGdlcy50b3A7XG4gICAgICBldmVudC5oZWlnaHQgPSBjdXJyZW50UmVzaXplLm9yaWdpbmFsSGVpZ2h0IC0gK3Jlc2l6ZUV2ZW50LmVkZ2VzLnRvcDtcbiAgICB9IGVsc2UgaWYgKHJlc2l6ZUV2ZW50LmVkZ2VzLmJvdHRvbSkge1xuICAgICAgZXZlbnQuaGVpZ2h0ID0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbEhlaWdodCArICtyZXNpemVFdmVudC5lZGdlcy5ib3R0b207XG4gICAgfVxuICB9XG5cbiAgcmVzaXplRW5kZWQoZGF5RXZlbnQ6IERheVZpZXdFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRSZXNpemU6IERheVZpZXdFdmVudFJlc2l6ZSA9IHRoaXMuY3VycmVudFJlc2l6ZXMuZ2V0KGRheUV2ZW50KTtcblxuICAgIGNvbnN0IHJlc2l6aW5nQmVmb3JlU3RhcnQgPSBjdXJyZW50UmVzaXplLmVkZ2UgPT09ICd0b3AnO1xuICAgIGxldCBwaXhlbHNNb3ZlZDogbnVtYmVyO1xuICAgIGlmIChyZXNpemluZ0JlZm9yZVN0YXJ0KSB7XG4gICAgICBwaXhlbHNNb3ZlZCA9IGRheUV2ZW50LnRvcCAtIGN1cnJlbnRSZXNpemUub3JpZ2luYWxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBpeGVsc01vdmVkID0gZGF5RXZlbnQuaGVpZ2h0IC0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbEhlaWdodDtcbiAgICB9XG5cbiAgICBkYXlFdmVudC50b3AgPSBjdXJyZW50UmVzaXplLm9yaWdpbmFsVG9wO1xuICAgIGRheUV2ZW50LmhlaWdodCA9IGN1cnJlbnRSZXNpemUub3JpZ2luYWxIZWlnaHQ7XG5cbiAgICBjb25zdCBtaW51dGVzTW92ZWQgPSBnZXRNaW51dGVzTW92ZWQoXG4gICAgICBwaXhlbHNNb3ZlZCxcbiAgICAgIHRoaXMuaG91clNlZ21lbnRzLFxuICAgICAgdGhpcy5ob3VyU2VnbWVudEhlaWdodCxcbiAgICAgIHRoaXMuZXZlbnRTbmFwU2l6ZVxuICAgICk7XG5cbiAgICBsZXQgbmV3U3RhcnQ6IERhdGUgPSBkYXlFdmVudC5ldmVudC5zdGFydDtcbiAgICBsZXQgbmV3RW5kOiBEYXRlID0gZ2V0RGVmYXVsdEV2ZW50RW5kKFxuICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgIGRheUV2ZW50LmV2ZW50LFxuICAgICAgZ2V0TWluaW11bUV2ZW50SGVpZ2h0SW5NaW51dGVzKHRoaXMuaG91clNlZ21lbnRzLCB0aGlzLmhvdXJTZWdtZW50SGVpZ2h0KVxuICAgICk7XG4gICAgaWYgKHJlc2l6aW5nQmVmb3JlU3RhcnQpIHtcbiAgICAgIG5ld1N0YXJ0ID0gdGhpcy5kYXRlQWRhcHRlci5hZGRNaW51dGVzKG5ld1N0YXJ0LCBtaW51dGVzTW92ZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdFbmQgPSB0aGlzLmRhdGVBZGFwdGVyLmFkZE1pbnV0ZXMobmV3RW5kLCBtaW51dGVzTW92ZWQpO1xuICAgIH1cblxuICAgIHRoaXMuZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCh7XG4gICAgICBuZXdTdGFydCxcbiAgICAgIG5ld0VuZCxcbiAgICAgIGV2ZW50OiBkYXlFdmVudC5ldmVudCxcbiAgICAgIHR5cGU6IENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFR5cGUuUmVzaXplXG4gICAgfSk7XG4gICAgdGhpcy5jdXJyZW50UmVzaXplcy5kZWxldGUoZGF5RXZlbnQpO1xuICB9XG5cbiAgZHJhZ1N0YXJ0ZWQoZXZlbnQ6IEhUTUxFbGVtZW50LCBkYXlFdmVudHNDb250YWluZXI6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgZHJhZ0hlbHBlcjogQ2FsZW5kYXJEcmFnSGVscGVyID0gbmV3IENhbGVuZGFyRHJhZ0hlbHBlcihcbiAgICAgIGRheUV2ZW50c0NvbnRhaW5lcixcbiAgICAgIGV2ZW50XG4gICAgKTtcbiAgICB0aGlzLnZhbGlkYXRlRHJhZyA9ICh7IHgsIHkgfSkgPT5cbiAgICAgIHRoaXMuY3VycmVudFJlc2l6ZXMuc2l6ZSA9PT0gMCAmJlxuICAgICAgZHJhZ0hlbHBlci52YWxpZGF0ZURyYWcoe1xuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICBzbmFwRHJhZ2dlZEV2ZW50czogdGhpcy5zbmFwRHJhZ2dlZEV2ZW50c1xuICAgICAgfSk7XG4gICAgdGhpcy5ldmVudERyYWdFbnRlciA9IDA7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBkcmFnRW5kZWQoZGF5RXZlbnQ6IERheVZpZXdFdmVudCwgZHJhZ0VuZEV2ZW50OiBEcmFnRW5kRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ldmVudERyYWdFbnRlciA+IDApIHtcbiAgICAgIGxldCBtaW51dGVzTW92ZWQgPSBnZXRNaW51dGVzTW92ZWQoXG4gICAgICAgIGRyYWdFbmRFdmVudC55LFxuICAgICAgICB0aGlzLmhvdXJTZWdtZW50cyxcbiAgICAgICAgdGhpcy5ob3VyU2VnbWVudEhlaWdodCxcbiAgICAgICAgdGhpcy5ldmVudFNuYXBTaXplXG4gICAgICApO1xuICAgICAgbGV0IG5ld1N0YXJ0OiBEYXRlID0gdGhpcy5kYXRlQWRhcHRlci5hZGRNaW51dGVzKFxuICAgICAgICBkYXlFdmVudC5ldmVudC5zdGFydCxcbiAgICAgICAgbWludXRlc01vdmVkXG4gICAgICApO1xuICAgICAgaWYgKGRyYWdFbmRFdmVudC55IDwgMCAmJiBuZXdTdGFydCA8IHRoaXMudmlldy5wZXJpb2Quc3RhcnQpIHtcbiAgICAgICAgbWludXRlc01vdmVkICs9IHRoaXMuZGF0ZUFkYXB0ZXIuZGlmZmVyZW5jZUluTWludXRlcyhcbiAgICAgICAgICB0aGlzLnZpZXcucGVyaW9kLnN0YXJ0LFxuICAgICAgICAgIG5ld1N0YXJ0XG4gICAgICAgICk7XG4gICAgICAgIG5ld1N0YXJ0ID0gdGhpcy52aWV3LnBlcmlvZC5zdGFydDtcbiAgICAgIH1cbiAgICAgIGxldCBuZXdFbmQ6IERhdGU7XG4gICAgICBpZiAoZGF5RXZlbnQuZXZlbnQuZW5kKSB7XG4gICAgICAgIG5ld0VuZCA9IHRoaXMuZGF0ZUFkYXB0ZXIuYWRkTWludXRlcyhkYXlFdmVudC5ldmVudC5lbmQsIG1pbnV0ZXNNb3ZlZCk7XG4gICAgICB9XG4gICAgICBpZiAoaXNEcmFnZ2VkV2l0aGluUGVyaW9kKG5ld1N0YXJ0LCBuZXdFbmQsIHRoaXMudmlldy5wZXJpb2QpKSB7XG4gICAgICAgIHRoaXMuZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCh7XG4gICAgICAgICAgbmV3U3RhcnQsXG4gICAgICAgICAgbmV3RW5kLFxuICAgICAgICAgIGV2ZW50OiBkYXlFdmVudC5ldmVudCxcbiAgICAgICAgICB0eXBlOiBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLkRyYWcsXG4gICAgICAgICAgYWxsRGF5OiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hIb3VyR3JpZCgpOiB2b2lkIHtcbiAgICB0aGlzLmhvdXJzID0gdGhpcy51dGlscy5nZXREYXlWaWV3SG91ckdyaWQoe1xuICAgICAgdmlld0RhdGU6IHRoaXMudmlld0RhdGUsXG4gICAgICBob3VyU2VnbWVudHM6IHRoaXMuaG91clNlZ21lbnRzLFxuICAgICAgZGF5U3RhcnQ6IHtcbiAgICAgICAgaG91cjogdGhpcy5kYXlTdGFydEhvdXIsXG4gICAgICAgIG1pbnV0ZTogdGhpcy5kYXlTdGFydE1pbnV0ZVxuICAgICAgfSxcbiAgICAgIGRheUVuZDoge1xuICAgICAgICBob3VyOiB0aGlzLmRheUVuZEhvdXIsXG4gICAgICAgIG1pbnV0ZTogdGhpcy5kYXlFbmRNaW51dGVcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVtaXRCZWZvcmVWaWV3UmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hWaWV3KCk6IHZvaWQge1xuICAgIHRoaXMudmlldyA9IHRoaXMudXRpbHMuZ2V0RGF5Vmlldyh7XG4gICAgICBldmVudHM6IHRoaXMuZXZlbnRzLFxuICAgICAgdmlld0RhdGU6IHRoaXMudmlld0RhdGUsXG4gICAgICBob3VyU2VnbWVudHM6IHRoaXMuaG91clNlZ21lbnRzLFxuICAgICAgZGF5U3RhcnQ6IHtcbiAgICAgICAgaG91cjogdGhpcy5kYXlTdGFydEhvdXIsXG4gICAgICAgIG1pbnV0ZTogdGhpcy5kYXlTdGFydE1pbnV0ZVxuICAgICAgfSxcbiAgICAgIGRheUVuZDoge1xuICAgICAgICBob3VyOiB0aGlzLmRheUVuZEhvdXIsXG4gICAgICAgIG1pbnV0ZTogdGhpcy5kYXlFbmRNaW51dGVcbiAgICAgIH0sXG4gICAgICBldmVudFdpZHRoOiB0aGlzLmV2ZW50V2lkdGgsXG4gICAgICBzZWdtZW50SGVpZ2h0OiB0aGlzLmhvdXJTZWdtZW50SGVpZ2h0XG4gICAgfSk7XG4gICAgdGhpcy5lbWl0QmVmb3JlVmlld1JlbmRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoQWxsKCk6IHZvaWQge1xuICAgIHRoaXMucmVmcmVzaEhvdXJHcmlkKCk7XG4gICAgdGhpcy5yZWZyZXNoVmlldygpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0QmVmb3JlVmlld1JlbmRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ob3VycyAmJiB0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMuYmVmb3JlVmlld1JlbmRlci5lbWl0KHtcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIGhvdXJHcmlkOiB0aGlzLmhvdXJzLFxuICAgICAgICAgIGFsbERheUV2ZW50czogdGhpcy52aWV3LmFsbERheUV2ZW50c1xuICAgICAgICB9LFxuICAgICAgICBwZXJpb2Q6IHRoaXMudmlldy5wZXJpb2RcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERheVZpZXdIb3VyU2VnbWVudCB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLWRheS12aWV3LWhvdXItc2VnbWVudCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAjZGVmYXVsdFRlbXBsYXRlXG4gICAgICBsZXQtc2VnbWVudD1cInNlZ21lbnRcIlxuICAgICAgbGV0LWxvY2FsZT1cImxvY2FsZVwiXG4gICAgICBsZXQtc2VnbWVudEhlaWdodD1cInNlZ21lbnRIZWlnaHRcIj5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJjYWwtaG91ci1zZWdtZW50XCJcbiAgICAgICAgW3N0eWxlLmhlaWdodC5weF09XCJzZWdtZW50SGVpZ2h0XCJcbiAgICAgICAgW2NsYXNzLmNhbC1ob3VyLXN0YXJ0XT1cInNlZ21lbnQuaXNTdGFydFwiXG4gICAgICAgIFtjbGFzcy5jYWwtYWZ0ZXItaG91ci1zdGFydF09XCIhc2VnbWVudC5pc1N0YXJ0XCJcbiAgICAgICAgW25nQ2xhc3NdPVwic2VnbWVudC5jc3NDbGFzc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXRpbWVcIj5cbiAgICAgICAgICB7eyBzZWdtZW50LmRhdGUgfCBjYWxlbmRhckRhdGU6J2RheVZpZXdIb3VyJzpsb2NhbGUgfX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgIHNlZ21lbnQ6IHNlZ21lbnQsXG4gICAgICAgIGxvY2FsZTogbG9jYWxlLFxuICAgICAgICBzZWdtZW50SGVpZ2h0OiBzZWdtZW50SGVpZ2h0XG4gICAgICB9XCI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckRheVZpZXdIb3VyU2VnbWVudENvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHNlZ21lbnQ6IERheVZpZXdIb3VyU2VnbWVudDtcblxuICBASW5wdXQoKVxuICBzZWdtZW50SGVpZ2h0OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgbG9jYWxlOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG59XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXlWaWV3RXZlbnQgfSBmcm9tICdjYWxlbmRhci11dGlscyc7XG5pbXBvcnQgeyBQbGFjZW1lbnRBcnJheSB9IGZyb20gJ3Bvc2l0aW9uaW5nJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLWRheS12aWV3LWV2ZW50JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICNkZWZhdWx0VGVtcGxhdGVcbiAgICAgIGxldC1kYXlFdmVudD1cImRheUV2ZW50XCJcbiAgICAgIGxldC10b29sdGlwUGxhY2VtZW50PVwidG9vbHRpcFBsYWNlbWVudFwiXG4gICAgICBsZXQtZXZlbnRDbGlja2VkPVwiZXZlbnRDbGlja2VkXCJcbiAgICAgIGxldC10b29sdGlwVGVtcGxhdGU9XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgbGV0LXRvb2x0aXBBcHBlbmRUb0JvZHk9XCJ0b29sdGlwQXBwZW5kVG9Cb2R5XCI+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50XCJcbiAgICAgICAgW3N0eWxlLmJhY2tncm91bmRDb2xvcl09XCJkYXlFdmVudC5ldmVudC5jb2xvcj8uc2Vjb25kYXJ5XCJcbiAgICAgICAgW3N0eWxlLmJvcmRlckNvbG9yXT1cImRheUV2ZW50LmV2ZW50LmNvbG9yPy5wcmltYXJ5XCJcbiAgICAgICAgW213bENhbGVuZGFyVG9vbHRpcF09XCJkYXlFdmVudC5ldmVudC50aXRsZSB8IGNhbGVuZGFyRXZlbnRUaXRsZTonZGF5VG9vbHRpcCc6ZGF5RXZlbnQuZXZlbnRcIlxuICAgICAgICBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgICAgW3Rvb2x0aXBFdmVudF09XCJkYXlFdmVudC5ldmVudFwiXG4gICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgW3Rvb2x0aXBBcHBlbmRUb0JvZHldPVwidG9vbHRpcEFwcGVuZFRvQm9keVwiXG4gICAgICAgIChtd2xDbGljayk9XCJldmVudENsaWNrZWQuZW1pdCgpXCI+XG4gICAgICAgIDxtd2wtY2FsZW5kYXItZXZlbnQtYWN0aW9uc1xuICAgICAgICAgIFtldmVudF09XCJkYXlFdmVudC5ldmVudFwiXG4gICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImV2ZW50QWN0aW9uc1RlbXBsYXRlXCI+XG4gICAgICAgIDwvbXdsLWNhbGVuZGFyLWV2ZW50LWFjdGlvbnM+XG4gICAgICAgICZuZ3NwO1xuICAgICAgICA8bXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlXG4gICAgICAgICAgW2V2ZW50XT1cImRheUV2ZW50LmV2ZW50XCJcbiAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUaXRsZVRlbXBsYXRlXCJcbiAgICAgICAgICB2aWV3PVwiZGF5XCI+XG4gICAgICAgIDwvbXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICBkYXlFdmVudDogZGF5RXZlbnQsXG4gICAgICAgIHRvb2x0aXBQbGFjZW1lbnQ6IHRvb2x0aXBQbGFjZW1lbnQsXG4gICAgICAgIGV2ZW50Q2xpY2tlZDogZXZlbnRDbGlja2VkLFxuICAgICAgICB0b29sdGlwVGVtcGxhdGU6IHRvb2x0aXBUZW1wbGF0ZSxcbiAgICAgICAgdG9vbHRpcEFwcGVuZFRvQm9keTogdG9vbHRpcEFwcGVuZFRvQm9keVxuICAgICAgfVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJEYXlWaWV3RXZlbnRDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBkYXlFdmVudDogRGF5Vmlld0V2ZW50O1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBQbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBBcHBlbmRUb0JvZHk6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KClcbiAgZXZlbnRUaXRsZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpXG4gIGV2ZW50QWN0aW9uc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAT3V0cHV0KClcbiAgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUmVzaXphYmxlTW9kdWxlIH0gZnJvbSAnYW5ndWxhci1yZXNpemFibGUtZWxlbWVudCc7XG5pbXBvcnQgeyBEcmFnQW5kRHJvcE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZSc7XG5pbXBvcnQgeyBDYWxlbmRhckRheVZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLWRheS12aWV3LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckRheVZpZXdIb3VyU2VnbWVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItZGF5LXZpZXctaG91ci1zZWdtZW50LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckRheVZpZXdFdmVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItZGF5LXZpZXctZXZlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyQ29tbW9uTW9kdWxlIH0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLWNvbW1vbi5tb2R1bGUnO1xuXG5leHBvcnQge1xuICBDYWxlbmRhckRheVZpZXdDb21wb25lbnQsXG4gIENhbGVuZGFyRGF5Vmlld0JlZm9yZVJlbmRlckV2ZW50XG59IGZyb20gJy4vY2FsZW5kYXItZGF5LXZpZXcuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBSZXNpemFibGVNb2R1bGUsXG4gICAgRHJhZ0FuZERyb3BNb2R1bGUsXG4gICAgQ2FsZW5kYXJDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ2FsZW5kYXJEYXlWaWV3Q29tcG9uZW50LFxuICAgIENhbGVuZGFyRGF5Vmlld0hvdXJTZWdtZW50Q29tcG9uZW50LFxuICAgIENhbGVuZGFyRGF5Vmlld0V2ZW50Q29tcG9uZW50XG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBSZXNpemFibGVNb2R1bGUsXG4gICAgRHJhZ0FuZERyb3BNb2R1bGUsXG4gICAgQ2FsZW5kYXJEYXlWaWV3Q29tcG9uZW50LFxuICAgIENhbGVuZGFyRGF5Vmlld0hvdXJTZWdtZW50Q29tcG9uZW50LFxuICAgIENhbGVuZGFyRGF5Vmlld0V2ZW50Q29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJEYXlNb2R1bGUge31cbiIsImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FsZW5kYXJDb21tb25Nb2R1bGUsXG4gIENhbGVuZGFyTW9kdWxlQ29uZmlnLFxuICBDYWxlbmRhckV2ZW50VGl0bGVGb3JtYXR0ZXIsXG4gIENhbGVuZGFyRGF0ZUZvcm1hdHRlclxufSBmcm9tICcuL2NvbW1vbi9jYWxlbmRhci1jb21tb24ubW9kdWxlJztcbmltcG9ydCB7IENhbGVuZGFyTW9udGhNb2R1bGUgfSBmcm9tICcuL21vbnRoL2NhbGVuZGFyLW1vbnRoLm1vZHVsZSc7XG5pbXBvcnQgeyBDYWxlbmRhcldlZWtNb2R1bGUgfSBmcm9tICcuL3dlZWsvY2FsZW5kYXItd2Vlay5tb2R1bGUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJEYXlNb2R1bGUgfSBmcm9tICcuL2RheS9jYWxlbmRhci1kYXkubW9kdWxlJztcbmltcG9ydCB7IENhbGVuZGFyVXRpbHMgfSBmcm9tICcuL2NvbW1vbi9jYWxlbmRhci11dGlscy5wcm92aWRlcic7XG5cbmV4cG9ydCAqIGZyb20gJy4vY29tbW9uL2NhbGVuZGFyLWNvbW1vbi5tb2R1bGUnO1xuZXhwb3J0ICogZnJvbSAnLi9tb250aC9jYWxlbmRhci1tb250aC5tb2R1bGUnO1xuZXhwb3J0ICogZnJvbSAnLi93ZWVrL2NhbGVuZGFyLXdlZWsubW9kdWxlJztcbmV4cG9ydCAqIGZyb20gJy4vZGF5L2NhbGVuZGFyLWRheS5tb2R1bGUnO1xuXG4vKipcbiAqIFRoZSBtYWluIG1vZHVsZSBvZiB0aGlzIGxpYnJhcnkuIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgQ2FsZW5kZXJNb2R1bGUgfSBmcm9tICdhbmd1bGFyLWNhbGVuZGFyJztcbiAqXG4gKiBATmdNb2R1bGUoe1xuICogICBpbXBvcnRzOiBbXG4gKiAgICAgQ2FsZW5kZXJNb2R1bGUuZm9yUm9vdCgpXG4gKiAgIF1cbiAqIH0pXG4gKiBjbGFzcyBNeU1vZHVsZSB7fVxuICogYGBgXG4gKlxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ2FsZW5kYXJDb21tb25Nb2R1bGUsXG4gICAgQ2FsZW5kYXJNb250aE1vZHVsZSxcbiAgICBDYWxlbmRhcldlZWtNb2R1bGUsXG4gICAgQ2FsZW5kYXJEYXlNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIENhbGVuZGFyQ29tbW9uTW9kdWxlLFxuICAgIENhbGVuZGFyTW9udGhNb2R1bGUsXG4gICAgQ2FsZW5kYXJXZWVrTW9kdWxlLFxuICAgIENhbGVuZGFyRGF5TW9kdWxlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChcbiAgICBkYXRlQWRhcHRlcjogUHJvdmlkZXIsXG4gICAgY29uZmlnOiBDYWxlbmRhck1vZHVsZUNvbmZpZyA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogQ2FsZW5kYXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgZGF0ZUFkYXB0ZXIsXG4gICAgICAgIGNvbmZpZy5ldmVudFRpdGxlRm9ybWF0dGVyIHx8IENhbGVuZGFyRXZlbnRUaXRsZUZvcm1hdHRlcixcbiAgICAgICAgY29uZmlnLmRhdGVGb3JtYXR0ZXIgfHwgQ2FsZW5kYXJEYXRlRm9ybWF0dGVyLFxuICAgICAgICBjb25maWcudXRpbHMgfHwgQ2FsZW5kYXJVdGlsc1xuICAgICAgXVxuICAgIH07XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJ2YWxpZGF0ZUV2ZW50c1dpdGhvdXRMb2ciLCJDb21wb25lbnQiLCJJbnB1dCIsInBvc2l0aW9uRWxlbWVudHMiLCJEaXJlY3RpdmUiLCJFbGVtZW50UmVmIiwiSW5qZWN0b3IiLCJSZW5kZXJlcjIiLCJDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIiLCJWaWV3Q29udGFpbmVyUmVmIiwiSW5qZWN0IiwiRE9DVU1FTlQiLCJIb3N0TGlzdGVuZXIiLCJFdmVudEVtaXR0ZXIiLCJPdXRwdXQiLCJmb3JtYXREYXRlIiwiSW5qZWN0YWJsZSIsInRzbGliXzEuX19leHRlbmRzIiwiUGlwZSIsIkxPQ0FMRV9JRCIsImdldE1vbnRoVmlldyIsImdldFdlZWtWaWV3SGVhZGVyIiwiZ2V0V2Vla1ZpZXciLCJnZXREYXlWaWV3IiwiZ2V0RGF5Vmlld0hvdXJHcmlkIiwiSW5qZWN0aW9uVG9rZW4iLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkNoYW5nZURldGVjdG9yUmVmIiwidHJpZ2dlciIsInRyYW5zaXRpb24iLCJzdHlsZSIsImFuaW1hdGUiLCJEcmFnQW5kRHJvcE1vZHVsZSIsIlJlc2l6YWJsZU1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0E7SUFFQSxJQUFJLGFBQWEsR0FBRyxVQUFTLENBQUMsRUFBRSxDQUFDO1FBQzdCLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYzthQUNoQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM1RSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUFFLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDL0UsT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQztBQUVGLHVCQUEwQixDQUFDLEVBQUUsQ0FBQztRQUMxQixhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLGdCQUFnQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ3ZDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekYsQ0FBQztBQUVELElBQU8sSUFBSSxRQUFRLEdBQUc7UUFDbEIsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksa0JBQWtCLENBQUM7WUFDM0MsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEdB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