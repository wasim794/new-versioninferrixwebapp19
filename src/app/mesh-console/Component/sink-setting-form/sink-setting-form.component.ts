import {Component, OnInit} from '@angular/core';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {MeshSinkService} from "../../shared/services";
import {UnsubscribeOnDestroyAdapter} from "../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {NumericKeyStaticData} from "../../../common/static-data/static-data";
import {forkJoin} from "rxjs";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule],
  providers: [DictionaryService, MeshSinkService],
  selector: 'app-sink-setting-form',
  templateUrl: './sink-setting-form.component.html',
  styleUrls: []
})
export class SinkSettingFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  roles!: NumericKeyStaticData[];
  isStackRunning!: boolean;
  address!: number;
  network!: string;
  channel!: number;
  role!: number;
  messages: any;

  constructor(
    public dictionaryService: DictionaryService,
    private _service: MeshSinkService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('meshConsole').subscribe();
    this.subs.add(forkJoin([
      this._service.getRoles(),
      this._service.getAddress(),
      this._service.getNetwork(),
      this._service.getChannel(),
      this._service.getRole()])
      .subscribe((result) => {
        this.roles = result[0];
        this.address = result[1].confirmMessage.attributeValue;
        this.network = result[2].confirmMessage.attributeValue.toUpperCase();
        this.channel = result[3].confirmMessage.attributeValue;
        this.role = result[4].confirmMessage.attributeValue;
        this.isStackRunning = true;
      }));
  }

  pushAddress(): void {
    this.subs.add(this._service.setAddress(this.address).subscribe((data) => {
      this.messages = data;
      SinkSettingFormComponent.showMessages();
    }));
  }

  pushNetwork(): void {
    this.subs.add(this._service.setNetwork(this.network).subscribe((data) => {
      this.messages = data;
      SinkSettingFormComponent.showMessages();
    }));
  }

  pushChannel(): void {
    this.subs.add(this._service.setChannel(this.channel).subscribe((data) => {
      this.messages = data;
      SinkSettingFormComponent.showMessages();
    }));
  }

  pushRole(): void {
    this.subs.add(this._service.setRole(this.role).subscribe((data) => {
      this.messages = data;
      SinkSettingFormComponent.showMessages();
    }));
  }

  startStack(): void {
    this.subs.add(this._service.startStack().subscribe((data) => {
      this.messages = data;
      if (data.confirmMessage.messageType === 'SUCCESS') {
        this.isStackRunning = true;
      }
      SinkSettingFormComponent.showMessages();
    }));
  }

  stopStack(): void {
    this.subs.add(this._service.stopStack().subscribe((data) => {
      this.messages = data;
      if (data.confirmMessage.messageType === 'SUCCESS') {
        this.isStackRunning = false;
      }
      SinkSettingFormComponent.showMessages();
    }));
  }

  private static showMessages() {
    // (<any>$('#messages')).show();
    // (<any>$('#messages')).fadeOut(2000);
  }
}
