import { Injectable } from '@angular/core';
import { DailyRecordService } from '../../../../disposition-ruche/Service/dailyRecordService';
import { type } from 'os';
import { webSocket } from 'rxjs/webSocket';
import { CONFIG } from '../../../../../../config';
//import { ECharts } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class CalendrierHealthService {


    constructor() {
    }

    option = {
    backgroundColor: 'white',
    title: {
        top: 20,
        text: 'Daily weight incomes',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: (params)=>{
            return params.data[0]+'<br/>'+params.seriesName;
        }    
    },
    toolbox: {
        feature: {
            /*dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'line']},
            restore: {show: true},*/
            saveAsImage: {show: true}
        }
    },
    legend: {
        top: '30',
        textStyle: {
            color: 'black'
        }
    },
   calendar: [{
        top: 140,
        width:'93%',
        range: ['2019-01-01', '2019-12-30'],
        orient: 'horizontal',
        cellSize: ['auto','40'],
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 4,
                type: 'solid'
            }
        },
        dayLabel: {
            //nameMap: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
            nameMap: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            firstDay: 1, // start on Monday

          },
          monthLabel: {
            margin: 10,
            nameMap: [
                'Jan.', 'Feb.', 'Mar.',

                'Apr.', 'May', 'Jun.',

                'Jul.', 'Aug.', 'Sep.',

                'Oct.', 'Nov.', 'Dec.'
            ]
        },
        yearLabel: {
            formatter: '{start}',
            show:false,
            textStyle: {
                color: 'black'
            }
        },
        itemStyle: {
            normal: {
                color: 'lightgrey',
                borderWidth: 1,
                borderColor: '#111'
            }
        }
    }],
    series : {
        type: 'custom',
        coordinateSystem: 'calendar',
        renderItem: this.renderItem,
        
    }
};

    renderItem(params, api){
        var cellPoint = api.coord(api.value(0),api.value(1));
        var cellWidth = params.coordSys.cellWidth;
        var cellHeight = params.coordSys.cellHeight;
        var img;
        var value = api.value(1);
    
        if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
            return;
        }
        //img = CONFIG.URL_FRONT+'/assets/icons/'+this.getStatus(api.value(1),api.value(2));
        switch (api.value(1)){
            case 'statusA':
                if(api.value(2) == "Fluctuation"){
                    img = 'wfbfl.png';
                }
                else if(api.value(2)=="Decline"){
                    img = 'wfbde.png';
                }
                else if(api.value(2) == "Stable"){
                    img = 'wfbst.png';
                }
                else if(api.value(2) == "Improve"){
                    img = 'wfbim.png';
                }
                break;
            case 'statusB':
                if(api.value(2) == "Fluctuation"){
                    img = 'wnbfl.png';
                }
                else if(api.value(2)=="Decline"){
                    img = 'wnbde.png';
                }
                else if(api.value(2) == "Stable"){
                    img = 'wnbst.png';
                }
                else if(api.value(2) == "Improve"){
                    img = 'wnbim.png';
                }
                break;
            case 'statusC':
                if(api.value(2) == "Fluctuation"){
                    img = 'wobfl.png';
                }
                else if(api.value(2) == "Improve"){
                    img = 'wobim.png';
                }
                break;
            default:
                img = 'wos.png';
        }
        img = CONFIG.URL_FRONT+'assets/icons/'+img;
        var group = {
            type: 'group',
            children:[{ // enfant de ce groupe(image et text)
                type:'image', // image
                style:{ // style de cette image
                    image:img, // image à afficher
                    width:30, // largeur
                    //heigth:30, // et hauteur de l'image
                    /*placement de l'image (x,y) avec les coordonnées */
                    x: cellPoint[0] - cellWidth /2+3,
                    y: cellPoint[1] - cellHeight / 2+5
                },
            }],
        };
        return group;
    }
    
}
