import { TemplateRef } from '@angular/core';
import { WeekViewHourColumn } from 'calendar-utils';
export declare class CalendarWeekViewHourSegmentComponent {
    segment: WeekViewHourColumn;
    segmentHeight: number;
    locale: string;
    isTimeLabel: boolean;
    customTemplate: TemplateRef<any>;
}
