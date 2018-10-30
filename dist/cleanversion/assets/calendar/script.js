var unChart = echarts.init(document.getElementById("main"));

var i=0;
var nb=[];
for(i=1;i<30;i++){
	nb.push(['2018-02-'+i,1]);
}
console.log(nb);
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
        type: 'heatmap', // type permettant une étiquette (label)
        coordinateSystem: 'calendar',
        symbolSize: 1,
        label: {
        	normal: {
        		show: true,
        		formatter: function (params) { // retourne chaine formaté pour les mettre ds le calendrier
                    var d = echarts.number.parseDate(params.value[0]);// conveti la valeur courante en date
                    return d.getDate(); // retourne seulement sous la forme AA-MM-JJ
                },
                textStyle: {
                    color: '#000'
                },
                verticalAlign :'midle'
            }
        },
        data: nb
    }],
	range: '2018-02'
};
unChart.setOption(options);