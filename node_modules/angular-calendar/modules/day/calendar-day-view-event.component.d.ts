import { EventEmitter, TemplateRef } from '@angular/core';
import { DayViewEvent } from 'calendar-utils';
import { PlacementArray } from 'positioning';
export declare class CalendarDayViewEventComponent {
    dayEvent: DayViewEvent;
    tooltipPlacement: PlacementArray;
    tooltipAppendToBody: boolean;
    customTemplate: TemplateRef<any>;
    eventTitleTemplate: TemplateRef<any>;
    eventActionsTemplate: TemplateRef<any>;
    tooltipTemplate: TemplateRef<any>;
    eventClicked: EventEmitter<any>;
}
