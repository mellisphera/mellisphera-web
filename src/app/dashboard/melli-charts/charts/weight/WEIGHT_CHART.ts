export const WEIGHT_CHARTS = {
    functionGain : (val: Array<any>) => {
        if (val[1] >= 0) {
            if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                return (0.5 * Math.sqrt((1000 * val[1])));
            } else {
                return (0.5 * Math.sqrt((1000 * val[1] * 0.45)));
            }  
        }
        else { return 0; }
    },

    functionLoss: (val: Array<any>) => {
        if (val[1] < 0) {
            if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                return (0.5 * Math.sqrt(Math.abs(1000 * val[1])));
            } else {
                return (0.5 * Math.sqrt(Math.abs(1000 * val[1] * 0.45)));
            }  
        }
        else { return 0; }
    },
    tooltipWeightCalendar: {
        trigger: 'item',
    },
}