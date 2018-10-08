"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var addDays = require("date-fns/add_days/index");
var addHours = require("date-fns/add_hours/index");
var addMinutes = require("date-fns/add_minutes/index");
var addSeconds = require("date-fns/add_seconds/index");
var differenceInDays = require("date-fns/difference_in_days/index");
var differenceInMinutes = require("date-fns/difference_in_minutes/index");
var differenceInSeconds = require("date-fns/difference_in_seconds/index");
var endOfDay = require("date-fns/end_of_day/index");
var endOfMonth = require("date-fns/end_of_month/index");
var endOfWeek = require("date-fns/end_of_week/index");
var getDay = require("date-fns/get_day/index");
var getMonth = require("date-fns/get_month/index");
var isSameDay = require("date-fns/is_same_day/index");
var isSameMonth = require("date-fns/is_same_month/index");
var isSameSecond = require("date-fns/is_same_second/index");
var max = require("date-fns/max/index");
var setHours = require("date-fns/set_hours/index");
var setMinutes = require("date-fns/set_minutes/index");
var startOfDay = require("date-fns/start_of_day/index");
var startOfMinute = require("date-fns/start_of_minute/index");
var startOfMonth = require("date-fns/start_of_month/index");
var startOfWeek = require("date-fns/start_of_week/index");
var getHours = require("date-fns/get_hours/index");
var getMinutes = require("date-fns/get_minutes/index");
function adapterFactory() {
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