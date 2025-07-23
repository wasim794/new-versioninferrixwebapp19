import {Component, OnInit} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {DictionaryService} from "../../../core/services/dictionary.service";
import {MeshConsoleService} from "../../shared/services";
import {NumericKeyStaticData} from "../../../common/static-data/static-data";

@Component({
  selector: 'app-diagnostics-setting-form',
  templateUrl: './diagnostics-setting-form.component.html',
  styleUrls: []
})
export class DiagnosticsSettingFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  intervals: NumericKeyStaticData[];
  interval: number;
  messages: any;

  constructor(
    public dictionaryService: DictionaryService,
    private _service: MeshConsoleService
  ) {
    super()
  }

  ngOnInit(): void {
    this._service.getDiagnosticsInterval().subscribe(data => this.intervals = data);
  }

  pushInterval(): void {
    this._service.setDiagnosticsInterval(this.interval).subscribe(data => {
      this.messages = data;
      DiagnosticsSettingFormComponent.showMessages();
    });
  }

  private static showMessages() {
    (<any>$('#messages')).show();
    (<any>$('#messages')).fadeOut(10000);
  }
}
