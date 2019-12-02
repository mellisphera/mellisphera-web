export const MEDIA_QUERY_MELLIUX = [
    {
        option: {
          calendar: {
            left: 'center',
            cellSize: [40, 40]
          }
        }
      },
      {
        query: {// 这里写规则
          maxWidth: 700,
        },
        option: {// 这里写此规则满足下的option
          calendar: {
            cellSize: [35, 35]
          },
        }
      },
      {
        query: {// 这里写规则
          maxWidth: 430,
        },
        option: {
          calendar: {
            //cellSize: [25, 25],
            left: 'center'
          },
          title: {
              left: 'center'
          },
          legend: {
              left: 'center'
          },
        }
      },
      {
        query: {// 这里写规则
          maxWidth: 300,
        },
        option: {
          calendar: {
            //cellSize: [25, 25],
            left: '15%'
          },
        }
      },
      {
        query: {// 这里写规则
          maxWidth: 260,
        },
        option: {
          calendar: {
            //cellSize: [25, 25],
            left: 'center'
          },
        }
      }
]