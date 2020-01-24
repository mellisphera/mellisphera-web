/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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