export const SERIES = {
    effectScatter: {
        name: 'gain',
        type: 'effectScatter',
        coordinateSystem: '',
        data: '',
        symbolSize: {},
        showEffectOn: 'emphasis',
        rippleEffect: {
            brushType: 'stroke'
        },
        itemStyle: {},
        hoverAnimation: true,
    },
    heatmap: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: []
    },
    custom: {
      type: 'custom',
      coordinateSystem: 'calendar',
      renderItem: null,
      data: []
    },
    line: {
        name: '',
        type: 'line',
        yAxisIndex: 0,
        data: [],
        showSymbol: false,
        hoverAnimation: true,
/*         markArea: {
          silent: true,
          itemStyle: {
            color: '#EBEBEB'
          },
          label: {
            show: true
          },
          data: [[{
            yAxis: this.unitSystem === 'METRIC' ? '33' : '90'
          }, {
            yAxis: this.unitSystem === 'METRIC' ? '37' : '100'
          }]]
        }, */
      }

}