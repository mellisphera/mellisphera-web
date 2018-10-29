import { GetMonthViewArgs, MonthView, GetWeekViewHeaderArgs, WeekDay, GetWeekViewArgs, GetDayViewArgs, DayView, GetDayViewHourGridArgs, DayViewHour, WeekView } from 'calendar-utils';
import { DateAdapter } from '../../date-adapters/date-adapter';
export declare class CalendarUtils {
    protected dateAdapter: DateAdapter;
    constructor(dateAdapter: DateAdapter);
    getMonthView(args: GetMonthViewArgs): MonthView;
    getWeekViewHeader(args: GetWeekViewHeaderArgs): WeekDay[];
    getWeekView(args: GetWeekViewArgs): WeekView;
    getDayView(args: GetDayViewArgs): DayView;
    getDayViewHourGrid(args: GetDayViewHourGridArgs): DayViewHour[];
}
