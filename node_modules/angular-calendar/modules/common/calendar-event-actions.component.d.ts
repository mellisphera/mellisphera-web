import { TemplateRef } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
export declare class CalendarEventActionsComponent {
    event: CalendarEvent;
    customTemplate: TemplateRef<any>;
    trackByIndex: (index: number) => number;
}
