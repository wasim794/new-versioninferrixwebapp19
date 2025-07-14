import {Component, Input, OnInit} from '@angular/core';
import {AbstractEventHandlerModel} from '../../../../core/models/events/handlers';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../../../core/services/dictionary.service";



@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: []
})
export class BasicFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
   @Input() handlerModel: AbstractEventHandlerModel<any>;
   UIDICTIONARY : any;

  constructor(  public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
  }
}
