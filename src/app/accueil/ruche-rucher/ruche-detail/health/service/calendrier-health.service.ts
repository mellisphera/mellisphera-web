import { Injectable } from '@angular/core';
import { DailyRecordService } from '../../../../disposition-ruche/Service/dailyRecordService';
import { type } from 'os';
import { webSocket } from 'rxjs/webSocket';
import { CONFIG } from '../../../../../../config';
import { CalendrierService } from '../../service/calendrier.service';
//import { ECharts } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class CalendrierHealthService  extends CalendrierService {


    constructor() {
        super();
    }

    option = {
    backgroundColor: 'white',
    title: {
        top: 70,
        text: 'Daily weight incomes',
        left: 'center',
        textStyle: {
            color: 'black'
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
        left: '2%',
        right: '4%',
        height:'200',
        width:'93%',
        range: null,
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
            formatter: '{start}-{end}',
            show:false,
            margin : 50,
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
        
        switch (api.value(1)){
            case 'statusC':
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
            case 'statusA':
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
        //img = CONFIG.URL_FRONT+'assets/icons/'+this.getIcon(api.value(1),api.value(2));
        var group = {
            type: 'group',
            children:[{ // enfant de ce groupe(image et text)
                type:'image', // image
                style:{ // style de cette image
                    image:img, // image à afficher
                    width:20, // largeur
                    //heigth:30, // et hauteur de l'image
                    /*placement de l'image (x,y) avec les coordonnées */
                    x: cellPoint[0] - cellWidth /2+5,
                    y: cellPoint[1] - cellHeight / 2+5
                },
            }],
        };
        return group;
    }
    
   /* getIcon(value1, value2){
        switch (value1){
            case 'statusC':
                if(value2 == "Fluctuation"){
                    return 'wfbfl.png';
                }
                else if(value2=="Decline"){
                    return 'wfbde.png';
                }
                else if(value2 == "Stable"){
                    return 'wfbst.png';
                }
                else if(value2 == "Improve"){
                    return 'wfbim.png';
                }
                break;
            case 'statusB':
                if(value2 == "Fluctuation"){
                    return 'wnbfl.png';
                }
                else if(value2=="Decline"){
                    return 'wnbde.png';
                }
                else if(value2 == "Stable"){
                    return 'wnbst.png';
                }
                else if(value2 == "Improve"){
                    return 'wnbim.png';
                }
                break;
            case 'statusA':
                if(value2 == "Fluctuation"){
                    return 'wobfl.png';
                }
                else if(value2 == "Improve"){
                    return 'wobim.png';
                }
                break;
            default:
                return 'wos.png';
            }
    }*/
}
