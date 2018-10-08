"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var date_fns_1 = require("calendar-utils/date-adapters/date-fns");
var addWeeks = require("date-fns/add_weeks/index");
var addMonths = require("date-fns/add_months/index");
var subDays = require("date-fns/sub_days/index");
var subWeeks = require("date-fns/sub_weeks/index");
var subMonths = require("date-fns/sub_months/index");
var getISOWeek = require("date-fns/get_iso_week/index");
var setDate = require("date-fns/set_date/index");
var setMonth = require("date-fns/set_month/index");
var setYear = require("date-fns/set_year/index");
var getDate = require("date-fns/get_date/index");
var getYear = require("date-fns/get_year/index");
function adapterFactory() {
    return tslib_1.__assign({}, date_fns_1.adapterFactory(), { addWeeks: addWeeks,
        addMonths: addMonths,
        subDays: subDays,
        subWeeks: subWeeks,
        subMonths: subMonths,
        getISOWeek: getISOWeek,
        setDate: setDate,
        setMonth: setMonth,
        setYear: setYear,
        getDate: getDate,
        getYear: getYear });
}
exports.adapterFactory = adapterFactory;
//# sourceMappingURL=index.js.map