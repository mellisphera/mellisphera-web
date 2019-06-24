import { Component, OnInit, Renderer2 } from '@angular/core';
import { RucheService } from '../service/ruche.service';
import { RucherService } from '../service/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { StackApiaryGraphService } from '../apiary/stack-apiary/service/stack-apiary-graph.service';
import { StackService } from '../apiary/stack-apiary/service/stack.service';
import { RecordService } from '../apiary/ruche-rucher/ruche-detail/service/Record/record.service';
import { AdminService } from '../admin/service/admin.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { RucheInterface } from '../../_model/ruche';
import { RucherModel } from '../../_model/rucher-model';
import { MelliChartsDateService } from './service/melli-charts-date.service';
import { DataRange } from '../apiary/ruche-rucher/ruche-detail/service/Record/data-range';

@Component({
  selector: 'app-melli-charts',
  templateUrl: './melli-charts.component.html',
  styleUrls: ['./melli-charts.component.css']
})
export class MelliChartsComponent implements OnInit {


  public btnNav: Array<string>;
  private btnTypeElement: HTMLElement;

  constructor(public rucheService: RucheService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    public stackApiaryGraph: StackApiaryGraphService,
    public melliChartDate: MelliChartsDateService,
    public stackService: StackService,
    public recordService: RecordService,
    private adminService: AdminService,
    private tokenService: AtokenStorageService,
    private userConfig: UserParamsService) {
      this.btnNav = [
        'Vitality',
        'Map',
        'Hives',
        'Stack'
      ];
    }

  ngOnInit() {
    this.userConfig.getSubject().subscribe(
      data => {
        this.recordService.setUnitSystem(data.unitSystem);
      }
    )
    if (!this.rucherService.rucherSubject.closed) {
      if (!this.tokenService.checkAuthorities('ROLE_ADMIN')) {
        this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
          this.rucherService.rucheService.getAllHiveByAccount(this.userService.getUser()).map((hives: RucheInterface[][]) => {
            let allHives = hives.flat();
            console.log(allHives);
            allHives.forEach((elt: RucheInterface) => {
              this.rucherService.findRucherById(elt.idApiary, (apiary: RucherModel[]) => {
                elt.apiaryName = apiary[0].name;
              });
            });
            return allHives;
          }).subscribe(
            hives => {
              console.log(hives);
              this.rucherService.rucheService.ruchesAllApiary = hives;
            }
          )
        });
      } else {
        this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
          this.adminService.getAllHive().map((hives) => {
            hives.forEach(elt => {
              this.rucherService.findRucherById(elt.idApiary, (apiary: RucherModel[]) => {
                try {
                  elt.apiaryName = apiary[0].name;
                } catch (e) { }
              });
            });
            return hives;
          }).subscribe((hives) => {
            this.rucherService.rucheService.ruchesAllApiary = hives;
          });
        });
      }
    }
  }

  /**
   *
   *
   * @returns {string}
   * @memberof MelliChartsComponent
   */
  getRangeSelect(): string {
    return (this.melliChartDate.rangeUserSelect.scale + ' ' + this.melliChartDate.rangeUserSelect.type).toLowerCase();
  }
  /**
   *
   *
   * @param {DataRange} rangeSelect
   * @memberof MelliChartsComponent
   */
  setRangeSelect(rangeSelect: DataRange): void {
    this.melliChartDate.rangeUserSelect = rangeSelect;
  }

  getHiveByApiary(idApiary: string): RucheInterface[] | boolean {
    try {
      return this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === idApiary);
    } catch (e) {
      return false;
    }
  }

  selectType(id: string) {
    this.btnTypeElement = document.getElementById(id);
    console.log(this.btnTypeElement);
  }
  selectHive(ruche: RucheInterface, event: MouseEvent) {
     
  }

}
