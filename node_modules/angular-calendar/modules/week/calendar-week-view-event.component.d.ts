import { EventEmitter, TemplateRef } from '@angular/core';
import { WeekViewAllDayEvent, DayViewEvent } from 'calendar-utils';
import { PlacementArray } from 'positioning';
export declare class CalendarWeekViewEventComponent {
    weekEvent: WeekViewAllDayEvent | DayViewEvent;
    tooltipPlacement: PlacementArray;
    tooltipAppendToBody: boolean;
    tooltipDisabled: boolean;
    customTemplate: TemplateRef<any>;
    eventTitleTemplate: TemplateRef<any>;
    eventActionsTemplate: TemplateRef<any>;
    tooltipTemplate: TemplateRef<any>;
    eventClicked: EventEmitter<any>;
}
