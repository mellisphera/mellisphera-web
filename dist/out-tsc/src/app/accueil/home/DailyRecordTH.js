var DailyRecordsTH = /** @class */ (function () {
    function DailyRecordsTH(recordDate, idHive, humidity_int_min, humidity_int_max, temp_int_min, temp_int_max, temp_int_moy, temp_int_stddev, health_status, health_trend, r_int_text) {
        this.recordDate = recordDate;
        this.idHive = idHive;
        this.humidity_int_min = humidity_int_min;
        this.humidity_int_max = humidity_int_max;
        this.temp_int_min = temp_int_min;
        this.temp_int_max = temp_int_max;
        this.temp_int_moy = temp_int_moy;
        this.temp_int_stddev = temp_int_stddev;
        this.health_status = health_status;
        this.health_trend = health_trend;
        this.r_int_text = r_int_text;
    }
    DailyRecordsTH.prototype.getIdHive = function () {
        return this.idHive;
    };
    DailyRecordsTH.prototype.getHealthStatus = function () {
        return this.health_status;
    };
    DailyRecordsTH.prototype.getHealthTrend = function () {
        return this.health_trend;
    };
    DailyRecordsTH.prototype.getColorStatus = function () {
        if (this.health_status == 'A') {
            return "statusA";
        }
        else if (this.health_status == 'B') {
            return 'statusB';
        }
        else {
            return 'statusC';
        }
    };
    return DailyRecordsTH;
}());
export { DailyRecordsTH };
//# sourceMappingURL=DailyRecordTH.js.map