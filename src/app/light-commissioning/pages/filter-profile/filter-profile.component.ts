import {Component, OnInit} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {ProfileService} from '../../shared/service';
import {FilterModel, NodesFilterModel} from '../../shared/model';
import {CommonService} from 'src/app/services/common.service';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-filter-profile',
  templateUrl: './filter-profile.component.html',
  styleUrls: []
})
export class FilterProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  frControllerProfileError: any = [];
  profileTypes = [];
  profileFilterModel = new NodesFilterModel();
  filter = {} as FilterModel;
  public UIDICTIONARY:any;

  constructor(private profileService: ProfileService, public dictionaryService: DictionaryService, private commonService: CommonService) {
    super();
  }

  ngOnInit() {
    this.getProfileTypes();
    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
  }

  getProfileTypes() {
    this.subs.add(this.profileService.getProfileType().subscribe(data => {
      this.profileTypes = data.items;
    }));
  }

  profileFilter(event, profileType) {
    if (event.source.selected) {
      this.filter.definition = profileType;
    }
  }

  filterProfile() {
    this.profileFilterModel.filters = this.filter;
    this.profileService.query(this.profileFilterModel).subscribe(data => {
      this.profileService.setProfileFilterSearch(data['items']);
      this.getProfileTypes();
      this.filter.name = null;
      if (JSON.stringify(data['items']) === '[]') {
        this.commonService.notification('Data does not exist please try again ');
      } else {
        this.commonService.notification('Data successfully matched ');
      }
    });
  }
}
