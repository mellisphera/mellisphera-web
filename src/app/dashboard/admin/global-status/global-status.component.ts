import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { CapteurInterface } from '../../../_model/capteur';
import * as echarts from 'echarts';
import { User } from '../../../_model/user';

@Component({
  selector: 'app-global-status',
  templateUrl: './global-status.component.html',
  styleUrls: ['./global-status.component.css']
})
export class GlobalStatusComponent implements OnInit {

  public options: any;
  private echartsInstace: any;
  private chartElement: HTMLElement;
  constructor(public adminService: AdminService) {
    this.options = {
/*       title : {
        text: 'Utilsateur',
    }, */
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        type: 'scroll',
        show: true,
        orient: 'vertical',
        textStyle: {
          color: 'white'
        },
        left: 'left',
        data: [],
    },  
    series : [
        {
            name: 'connection',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            //rayon: '70%',
            data: [],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
              normal: {
                  show: false
              },
              emphasis: {
                  show: true
              }
          },
          lableLine: {
              normal: {
                  show: false
              },
              emphasis: {
                  show: true
              }
          },
        }
    ]
    }
  }

  ngOnInit() {
    this.chartElement = document.getElementById('chart-pie');
    console.log(document.getElementById('chart-pie'));
    this.echartsInstace = echarts.init(<HTMLDivElement>this.chartElement);  
    this.options.series[0].data = this.adminService.allUsers.filter(_filter => _filter.username !== 'LPO').map((res: User) => {
      return {name: res.username, value: res.connexions};
    })
    this.options.legend.data = this.adminService.allUsers.filter(_filter => _filter.username !== 'LPO').map((res: User) => res.username);
    this.echartsInstace.setOption(this.options);
    console.log(this.echartsInstace.getOption());

  }

}
