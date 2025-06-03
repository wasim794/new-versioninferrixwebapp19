import {Description} from './description';
import {CommonService} from '../../services/common.service';

export class GlobalProperties {
  public static pollingPeriodType: any[] = [{key: 'SECONDS', val: 'seconds'}, {key: 'MINUTES', val: 'minutes'}, {key: 'HOURS', val: 'hours'}];
  constructor(private commonService: CommonService) {
  }
  setDefaultPermission() {
    this.commonService.getPermission().subscribe(data => {
      return  data;
    }, err => console.log(err));
  }
}
