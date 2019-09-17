export const MAP = {
    baseOption :  {
        geo: {
            center: [-43.09933918571744, 35.94920517555574],
            zoom: 4,
            map: 'world',
            roam: true,
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: 'rgba(0,0,0,0.4)'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                },
                emphasis: {
                    areaColor: null,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            regions: [{
                name: 'France',
                itemStyle: {
                    areaColor: 'lightgrey',
                    color: 'red'
                }
            }, {
                name: 'United States',
                itemStyle: {
                    areaColor: 'lightgrey',
                    color: 'red'
                }
            }]
    
        },
        textStyle: {
            fontFamily: 'poppins',
        },
        timeline: {
            axisType: 'category',
            orient: 'horizontal',
            autoPlay: true,
            inverse: true,
            playInterval: 1000,
            width: '90%',
            top: '95%',
            height: null,
            left: 'center',
            label: {
                textStyle: {
                    color: '#4F4F51'
                }
            },
            lineStyle: {
                color: '#4F4F51'
            },
            checkpointStyle: {
                color: '#4F4F51',
                borderColor: '#4F4F51',
                borderWidth: 2
            },
            controlStyle: {
                showNextBtn: true,
                showPrevBtn: true,
                normal: {
                    color: '#4F4F51',
                    borderColor: '#666'
                },
                emphasis: {
                    color: '#4F4F51',
                    borderColor: '#4F4F51'
                }
            },
            data: []
        },
        backgroundColor: 'lightblue',
        tooltip: {
            padding: 5,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: (params) => {
                return params.data[4];
            }
        },
        grid: {
            //top: 100,
            containLabel: true,
            left: 30,
            width: '95%'
            // right: '110'
        },

    },
    options: []
};