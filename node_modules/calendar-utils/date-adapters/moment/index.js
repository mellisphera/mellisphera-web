"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function adapterFactory(moment) {
    function addDays(date, amount) {
        return moment(date)
            .add(amount, 'days')
            .toDate();
    }
    function addHours(date, amount) {
        return moment(date)
            .add(amount, 'hours')
            .toDate();
    }
    function addMinutes(date, amount) {
        return moment(date)
            .add(amount, 'minutes')
            .toDate();
    }
    function addSeconds(date, amount) {
        return moment(date)
            .add(amount, 'seconds')
            .toDate();
    }
    function differenceInDays(dateLeft, dateRight) {
        return moment(dateLeft).diff(moment(dateRight), 'days');
    }
    function differenceInMinutes(dateLeft, dateRight) {
        return moment(dateLeft).diff(moment(dateRight), 'minutes');
    }
    function differenceInSeconds(dateLeft, dateRight) {
        return moment(dateLeft).diff(moment(dateRight), 'seconds');
    }
    function endOfDay(date) {
        return moment(date)
            .endOf('day')
            .toDate();
    }
    function endOfMonth(date) {
        return moment(date)
            .endOf('month')
            .toDate();
    }
    function endOfWeek(date) {
        return moment(date)
            .endOf('week')
            .toDate();
    }
    function getDay(date) {
        return moment(date).day();
    }
    function getMonth(date) {
        return moment(date).month();
    }
    function isSameDay(dateLeft, dateRight) {
        return moment(dateLeft).isSame(moment(dateRight), 'day');
    }
    function isSameMonth(dateLeft, dateRight) {
        return moment(dateLeft).isSame(moment(dateRight), 'month');
    }
    function isSameSecond(dateLeft, dateRight) {
        return moment(dateLeft).isSame(moment(dateRight), 'second');
    }
    function max() {
        var dates = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dates[_i] = arguments[_i];
        }
        return moment.max(dates.map(function (date) { return moment(date); })).toDate();
    }
    function setHours(date, hours) {
        return moment(date)
            .hours(hours)
            .toDate();
    }
    function setMinutes(date, minutes) {
        return moment(date)
            .minutes(minutes)
            .toDate();
    }
    function startOfDay(date) {
        return moment(date)
            .startOf('day')
            .toDate();
    }
    function startOfMinute(date) {
        return moment(date)
            .startOf('minute')
            .toDate();
    }
    function startOfMonth(date) {
        return moment(date)
            .startOf('month')
            .toDate();
    }
    function startOfWeek(date) {
        return moment(date)
            .startOf('week')
            .toDate();
    }
    function getHours(date) {
        return moment(date).hours();
    }
    function getMinutes(date) {
        return moment(date).minutes();
    }
    return {
        addDays: addDays,
        addHours: addHours,
        addMinutes: addMinutes,
        addSeconds: addSeconds,
        differenceInDays: differenceInDays,
        differenceInMinutes: differenceInMinutes,
        differenceInSeconds: differenceInSeconds,
        endOfDay: endOfDay,
        endOfMonth: endOfMonth,
        endOfWeek: endOfWeek,
        getDay: getDay,
        getMonth: getMonth,
        isSameDay: isSameDay,
        isSameMonth: isSameMonth,
        isSameSecond: isSameSecond,
        max: max,
        setHours: setHours,
        setMinutes: setMinutes,
        startOfDay: startOfDay,
        startOfMinute: startOfMinute,
        startOfMonth: startOfMonth,
        startOfWeek: startOfWeek,
        getHours: getHours,
        getMinutes: getMinutes
    };
}
exports.adapterFactory = adapterFactory;
//# sourceMappingURL=index.js.map