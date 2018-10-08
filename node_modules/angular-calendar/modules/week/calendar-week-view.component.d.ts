import { EventEmitter, ChangeDetectorRef, OnChanges, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { WeekDay, CalendarEvent, WeekViewAllDayEvent, WeekView, WeekViewHourColumn, DayViewEvent, DayViewHourSegment, DayViewHour } from 'calendar-utils';
import { ResizeEvent } from 'angular-resizable-element';
import { CalendarEventTimesChangedEvent } from '../common/calendar-event-times-changed-event.interface';
import { CalendarUtils } from '../common/calendar-utils.provider';
import { DateAdapter } from '../../date-adapters/date-adapter';
import { DragEndEvent, DropEvent, DragMoveEvent } from 'angular-draggable-droppable';
import { PlacementArray } from 'positioning';
export interface WeekViewAllDayEventResize {
    originalOffset: number;
    originalSpan: number;
    edge: string;
}
export interface CalendarWeekViewBeforeRenderEvent extends WeekView {
    header: WeekDay[];
}
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
export declare class CalendarWeekViewComponent implements OnChanges, OnInit, OnDestroy {
    private cdr;
    private utils;
    private dateAdapter;
    /**
     * The current view date
     */
    viewDate: Date;
    /**
     * An array of events to display on view
     * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    events: CalendarEvent[];
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    excludeDays: number[];
    /**
     * An observable that when emitted on will re-render the current view
     */
    refresh: Subject<any>;
    /**
     * The locale used to format dates
     */
    locale: string;
    /**
     * The placement of the event tooltip
     */
    tooltipPlacement: PlacementArray;
    /**
     * A custom template to use for the event tooltips
     */
    tooltipTemplate: TemplateRef<any>;
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    tooltipAppendToBody: boolean;
    /**
     * The start number of the week
     */
    weekStartsOn: number;
    /**
     * A custom template to use to replace the header
     */
    headerTemplate: TemplateRef<any>;
    /**
     * A custom template to use for week view events
     */
    eventTemplate: TemplateRef<any>;
    /**
     * A custom template to use for event titles
     */
    eventTitleTemplate: TemplateRef<any>;
    /**
     * A custom template to use for event actions
     */
    eventActionsTemplate: TemplateRef<any>;
    /**
     * The precision to display events.
     * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
     */
    precision: 'days' | 'minutes';
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that indicate which days are weekends
     */
    weekendDays: number[];
    /**
     * Whether to snap events to a grid when dragging
     */
    snapDraggedEvents: boolean;
    /**
     * The number of segments in an hour. Must be <= 6
     */
    hourSegments: number;
    /**
     * The height in pixels of each hour segment
     */
    hourSegmentHeight: number;
    /**
     * The day start hours in 24 hour time. Must be 0-23
     */
    dayStartHour: number;
    /**
     * The day start minutes. Must be 0-59
     */
    dayStartMinute: number;
    /**
     * The day end hours in 24 hour time. Must be 0-23
     */
    dayEndHour: number;
    /**
     * The day end minutes. Must be 0-59
     */
    dayEndMinute: number;
    /**
     * A custom template to use to replace the hour segment
     */
    hourSegmentTemplate: TemplateRef<any>;
    /**
     * The grid size to snap resizing and dragging of hourly events to
     */
    eventSnapSize: number;
    /**
     * A custom template to use for the all day events label text
     */
    allDayEventsLabelTemplate: TemplateRef<any>;
    /**
     * The number of days in a week. Can be used to create a shorter or longer week view.
     * The first day of the week will always be the `viewDate`
     */
    daysInWeek: number;
    /**
     * Called when a header week day is clicked. Adding a `cssClass` property on `$event.day` will add that class to the header element
     */
    dayHeaderClicked: EventEmitter<{
        day: WeekDay;
    }>;
    /**
     * Called when the event title is clicked
     */
    eventClicked: EventEmitter<{
        event: CalendarEvent<any>;
    }>;
    /**
     * Called when an event is resized or dragged and dropped
     */
    eventTimesChanged: EventEmitter<CalendarEventTimesChangedEvent<any>>;
    /**
     * An output that will be called before the view is rendered for the current week.
     * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
     */
    beforeViewRender: EventEmitter<CalendarWeekViewBeforeRenderEvent>;
    /**
     * Called when an hour segment is clicked
     */
    hourSegmentClicked: EventEmitter<{
        date: Date;
    }>;
    /**
     * @hidden
     */
    days: WeekDay[];
    /**
     * @hidden
     */
    view: WeekView;
    /**
     * @hidden
     */
    refreshSubscription: Subscription;
    /**
     * @hidden
     */
    allDayEventResizes: Map<WeekViewAllDayEvent, WeekViewAllDayEventResize>;
    /**
     * @hidden
     */
    timeEventResizes: Map<CalendarEvent, ResizeEvent>;
    /**
     * @hidden
     */
    eventDragEnter: number;
    /**
     * @hidden
     */
    dragActive: boolean;
    /**
     * @hidden
     */
    validateDrag: (args: any) => boolean;
    /**
     * @hidden
     */
    validateResize: (args: any) => boolean;
    /**
     * @hidden
     */
    dayColumnWidth: number;
    /**
     * @hidden
     */
    calendarId: symbol;
    /**
     * @hidden
     */
    trackByIndex: (index: number) => number;
    /**
     * @hidden
     */
    trackByWeekDayHeaderDate: (index: number, day: WeekDay) => string;
    /**
     * @hidden
     */
    trackByHourSegment: (index: number, segment: DayViewHourSegment) => string;
    /**
     * @hidden
     */
    trackByHour: (index: number, hour: DayViewHour) => string;
    /**
     * @hidden
     */
    trackByDayOrWeekEvent: (index: number, weekEvent: WeekViewAllDayEvent | DayViewEvent) => string | number | CalendarEvent<any>;
    /**
     * @hidden
     */
    trackByHourColumn: (index: number, column: WeekViewHourColumn) => string | WeekViewHourColumn;
    /**
     * @hidden
     */
    constructor(cdr: ChangeDetectorRef, utils: CalendarUtils, locale: string, dateAdapter: DateAdapter);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: any): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    private resizeStarted;
    /**
     * @hidden
     */
    timeEventResizeStarted(eventsContainer: HTMLElement, timeEvent: DayViewEvent, resizeEvent: ResizeEvent): void;
    /**
     * @hidden
     */
    timeEventResizing(timeEvent: DayViewEvent, resizeEvent: ResizeEvent): void;
    /**
     * @hidden
     */
    timeEventResizeEnded(timeEvent: DayViewEvent): void;
    /**
     * @hidden
     */
    allDayEventResizeStarted(allDayEventsContainer: HTMLElement, allDayEvent: WeekViewAllDayEvent, resizeEvent: ResizeEvent): void;
    /**
     * @hidden
     */
    allDayEventResizing(allDayEvent: WeekViewAllDayEvent, resizeEvent: ResizeEvent, dayWidth: number): void;
    /**
     * @hidden
     */
    allDayEventResizeEnded(allDayEvent: WeekViewAllDayEvent): void;
    /**
     * @hidden
     */
    getDayColumnWidth(eventRowContainer: HTMLElement): number;
    /**
     * @hidden
     */
    eventDropped(dropEvent: DropEvent<{
        event?: CalendarEvent;
        calendarId?: symbol;
    }>, date: Date, allDay: boolean): void;
    /**
     * @hidden
     */
    dragStarted(eventsContainer: HTMLElement, event: HTMLElement, dayEvent?: DayViewEvent): void;
    /**
     * @hidden
     */
    dragMove(dayEvent: DayViewEvent, dragEvent: DragMoveEvent): void;
    /**
     * @hidden
     */
    dragEnded(weekEvent: WeekViewAllDayEvent | DayViewEvent, dragEndEvent: DragEndEvent, dayWidth: number, useY?: boolean): void;
    private refreshHeader;
    private refreshBody;
    private refreshAll;
    private emitBeforeViewRender;
    private getWeekView;
    private getDragMovedEventTimes;
    private restoreOriginalEvents;
    private getTimeEventResizedDates;
}
