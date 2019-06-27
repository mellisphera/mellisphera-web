export const SERIES = {
    effectScatter: {
        name: 'gain',
        type: 'effectScatter',
        coordinateSystem: '',
        data: '',
        symbolSize: null,
        showEffectOn: 'emphasis',
        rippleEffect: {
            brushType: 'stroke'
        },
        hoverAnimation: true,
    },
    heatmap: {
        type: 'heatmap',
        coordinateSystem: '',
    },
    line: {
        name: '',
        type: 'line',
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