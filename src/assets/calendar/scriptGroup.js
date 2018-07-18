var unChart = echarts.init(document.getElementById("main"));

function renderItem(params,api){ // fonction qui sera appelée pour chaque valeur dans data
    var cellPoint = api.coord([api.value(0),api.value(1)]); // utilise les valeurs des données pour obtenir des coordonnées
    var img; // variable pour chemin de l'image

    if(api.value(1)<50){ // image aléatoire
        img='nuage.png';
    }
    else{
        img='sun.png'
    }
    return { // retourne un type group (ensemble de plusieurs élements)
        type:'group',
        children:[{ // enfant de ce groupe(image et text)
            type:'image', // image
            style:{ // style de cette image
                image:img, // image à afficher
                width:40, // largeur
                heigth:30, // et hauteur de l'image
                /* placement de l'image (x,y) avec les coordonnées */
                x : cellPoint[0]-25,
                y : cellPoint[1]-13
            }
        },
        {
            type:'text', // affiche le numero du jour
            style:{
                /* placement */
                x : cellPoint[0],
                y : cellPoint[1]-18,
                text:echarts.format.formatTime('dd', api.value(0)) // indique que l'on veut seulement afficher le jour
            }
        }]
    };
}

var i=0;
var tabData=[];
for(i=1;i<29;i++){ // boucle qui génére les valeurs
    tabData.push(['2018-02-'+i,(Math.random()*100).toFixed()]);
}
console.log(tabData);
var options={ // initialisateur d'objet
    /* Proprieté */
    title:{
        text : 'Calendrier'
    },

    tooltip:{ // Active info bulle au survol de la souris
        /* Contenu bulle et propriété */
        formatter:function(params){ // permet d'afficher sous un certain format le contenu de la bulle
            var temps;
            if(params.value[1]>50){
                temps="Beau temps";
            }
            else{
                temps="Mauvais temps";
            }
            return echarts.format.formatTime('dd-yyyy', params.value[0])+" "+temps;
        }
    },// Définit un calendrier
    calendar:{
        cellSize : 60, // taille cellule
        orient : 'vertical', // orientation calendrier
        splitLine: { // style bordure
            show: true,
            lineStyle: {
                width:3,
                opacity:1
            }
        },
         itemStyle: { // style calendrier
            normal: {
                color: 'rgba(123,123,123,0.3)',
                borderWidth: 1,
                borderColor: 'white'
            }
        },
        dayLabel:{ // Affiche le nom des jour
            nameMap:'fr' // langue francais
        },
        yearLabel:{ // Affiche l'année
            show:false // desactiver
        }
    },

    series: [{ // Type de données et valeur
        type: 'custom', // définit un type personnaliser
        coordinateSystem: 'calendar', // type de coordonnée

        renderItem:renderItem, // pour chaque valeur dans data cette fonction sera appelé
        data: tabData // Valeur à ajouter au calendrier (tableau de date)
    }],
    range: ['2018-02','2018-03-31'] // plage calendrier
};
unChart.setOption(options); // aplique les options définis plus haut