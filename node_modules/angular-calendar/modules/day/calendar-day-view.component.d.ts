import { OnChanges, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { CalendarEvent, DayView, DayViewHour, DayViewHourSegment, DayViewEvent, ViewPeriod, WeekViewAllDayEvent } from 'calendar-utils';
import { Subject, Subscription } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';
import { CalendarEventTimesChangedEvent } from '../common/calendar-event-times-changed-event.interface';
import { CalendarUtils } from '../common/calendar-utils.provider';
import { DateAdapter } from '../../date-adapters/date-adapter';
import { DragEndEvent } from 'angular-draggable-droppable';
import { PlacementArray } from 'positioning';
export interface CalendarDayViewBeforeRenderEvent {
    body: {
        hourGrid: DayViewHour[];
        allDayEvents: CalendarEvent[];
    };
    period: ViewPeriod;
}
/**
 * @hidden
 */
export interface DayViewEventResize {
    originalTop: number;
    originalHeight: number;
    edge: string;
}
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
export declare class CalendarDayViewComponent implements OnChanges, OnInit, OnDestroy {
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
     * The width in pixels of each event on the view
     */
    eventWidth: number;
    /**
     * An observable that when emitted on will re-render the current view
     */
    refresh: Subject<any>;
    /**
     * The locale used to format dates
     */
    locale: string;
    /**
     * The grid size to snap resizing and dragging of events to
     */
    eventSnapSize: number;
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
     * A custom template to use to replace the hour segment
     */
    hourSegmentTemplate: TemplateRef<any>;
    /**
     * A custom template to use for day view events
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
     * Whether to snap events to a grid when dragging
     */
    snapDraggedEvents: boolean;
    /**
     * Called when an event title is clicked
     */
    eventClicked: EventEmitter<{
        event: CalendarEvent<any>;
    }>;
    /**
     * Called when an hour segment is clicked
     */
    hourSegmentClicked: EventEmitter<{
        date: Date;
    }>;
    /**
     * Called when an event is resized or dragged and dropped
     */
    eventTimesChanged: EventEmitter<CalendarEventTimesChangedEvent<any>>;
    /**
     * An output that will be called before the view is rendered for the current day.
     * If you add the `cssClass` property to an hour grid segment it will add that class to the hour segment in the template
     */
    beforeViewRender: EventEmitter<CalendarDayViewBeforeRenderEvent>;
    /**
     * @hidden
     */
    hours: DayViewHour[];
    /**
     * @hidden
     */
    view: DayView;
    /**
     * @hidden
     */
    width: number;
    /**
     * @hidden
     */
    refreshSubscription: Subscription;
    /**
     * @hidden
     */
    currentResizes: Map<DayViewEvent, DayViewEventResize>;
    /**
     * @hidden
     */
    eventDragEnter: number;
    /**
     * @hidden
     */
    calendarId: symbol;
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
    trackByEventId: (index: number, event: CalendarEvent<any>) => string | number | CalendarEvent<any>;
    /**
     * @hidden
     */
    trackByHour: (index: number, hour: DayViewHour) => string;
    /**
     * @hidden
     */
    trackByHourSegment: (index: number, segment: DayViewHourSegment) => string;
    /**
     * @hidden
     */
    trackByDayEvent: (index: number, weekEvent: WeekViewAllDayEvent | DayViewEvent) => string | number | CalendarEvent<any>;
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
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: any): void;
    eventDropped(dropEvent: {
        dropData?: {
            event?: CalendarEvent;
            calendarId?: symbol;
        };
    }, date: Date, allDay: boolean): void;
    resizeStarted(event: DayViewEvent, resizeEvent: ResizeEvent, dayEventsContainer: HTMLElement): void;
    resizing(event: DayViewEvent, resizeEvent: ResizeEvent): void;
    resizeEnded(dayEvent: DayViewEvent): void;
    dragStarted(event: HTMLElement, dayEventsContainer: HTMLElement): void;
    dragEnded(dayEvent: DayViewEvent, dragEndEvent: DragEndEvent): void;
    private refreshHourGrid;
    private refreshView;
    private refreshAll;
    private emitBeforeViewRender;
}
