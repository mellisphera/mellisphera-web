export const MEDIA_QUERY_MELLIUX = [
    {
        option: {
          calendar: {
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
            cellSize: [30, 30]
          },
        }
      },
]