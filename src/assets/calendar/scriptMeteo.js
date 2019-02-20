var unChart = echarts.init(document.getElementById("main"));

function renderItem(params,api){
    var cellPoint = api.coord([api.value(0),api.value(1)]); // coordonné
    var cellWidth = params.coordSys.cellWidth;
    var cellHeight = params.coordSys.cellHeight;
    /* 
        retourne un élément graphique

    */
    return {
        type:'image',
        style:{
            image :'nuage.png',
            width:40,
            heigth:30,
            textAlign : 'midle',
            x : cellPoint[0],
            y : cellPoint[1] - (cellHeight / 2 + 15)+10,
        }
    };
}

var i=0;
var nb=[];
for(i=1;i<30;i++){
    nb.push(['2018-02-'+i,1]);
}
var i=0;
var options={
    title:{
        text : 'Calendrier'
    },

    visualMap: {
        show: true,
        min: 0,
        max: 300,
        //seriesIndex: [2],
        orient: 'horizontal',
        left: 'center',
    },
    tooltip:{
        formatter:function(params){
            return params.value[0];
        }
    },
    calendar:{
        cellSize : 60,
        orient : 'vertical',
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 4,
                type: 'solid'
            }
        },
        dayLabel:{
            align : 'center',
            nameMap:'fr'
        },
        yearLabel:{
            show:false
        }
    },
    series: [{
        type: 'custom',
        coordinateSystem: 'calendar',
        symbolSize: 1,

        renderItem:renderItem,
        data: nb
    }],
    range: '2018-02'
};
unChart.setOption(options);