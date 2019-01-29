var unChart = echarts.init(document.getElementById("main"));
function renderItem(params, api) {
    var cellPoint = api.coord([api.value(0), api.value(1)]); // utilise les valeurs des données pour obtenir des coordonnées
    var img; // variable pour chemin de l'image
    if (api.value(1) < 50) {
        img = 'nuage.png';
    }
    else {
        img = 'sun.png';
    }
    return {
        type: 'group',
        children: [{
                type: 'image',
                style: {
                    image: img,
                    width: 40,
                    heigth: 30,
                    /* placement de l'image (x,y) avec les coordonnées */
                    x: cellPoint[0] - 25,
                    y: cellPoint[1] - 13
                }
            },
            {
                type: 'text',
                style: {
                    /* placement */
                    x: cellPoint[0],
                    y: cellPoint[1] - 18,
                    text: echarts.format.formatTime('dd', api.value(0)) // indique que l'on veut seulement afficher le jour
                }
            }]
    };
}
var i = 0;
var tabData = [];
for (i = 1; i < 29; i++) {
    tabData.push(['2018-02-' + i, (Math.random() * 100).toFixed()]);
}
var options = {
    /* Proprieté */
    title: {
        text: 'Calendrier'
    },
    tooltip: {
        /* Contenu bulle et propriété */
        formatter: function (params) {
            var temps;
            if (params.value[1] > 50) {
                temps = "Beau temps";
            }
            else {
                temps = "Mauvais temps";
            }
            return echarts.format.formatTime('dd-yyyy', params.value[0]) + " " + temps;
        }
    },
    calendar: {
        cellSize: 60,
        orient: 'vertical',
        splitLine: {
            show: true,
            lineStyle: {
                width: 3,
                opacity: 1
            }
        },
        itemStyle: {
            normal: {
                color: 'rgba(123,123,123,0.3)',
                borderWidth: 1,
                borderColor: 'white'
            }
        },
        dayLabel: {
            nameMap: 'fr' // langue francais
        },
        yearLabel: {
            show: false // desactiver
        }
    },
    series: [{
            type: 'custom',
            coordinateSystem: 'calendar',
            renderItem: renderItem,
            data: tabData // Valeur à ajouter au calendrier (tableau de date)
        }],
    range: ['2018-02', '2018-03-31'] // plage calendrier
};
unChart.setOption(options); // aplique les options définis plus haut
