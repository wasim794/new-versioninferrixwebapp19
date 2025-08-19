import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DictionaryService} from "../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [DictionaryService],
  selector: 'app-modbus-configration',
  templateUrl: './modbus-configration.component.html',
  styleUrls: []
})
export class ModbusConfigrationComponent implements OnInit {
  commonUrl = '/mesh-console/modbus/';
  UIDICTIONARY:any;

  constructor(private router: Router, public dictionaryService: DictionaryService,) {
  }

  Profile = 'profile';
  Commissioned = 'commissioned';
  Discovered = 'discovered';
  ModbusDevice = 'device';
  ModbusAttribute = 'attribute';

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
  }

  private profile(event: any) {
    this.router.navigate([this.commonUrl + event]);
  }

  private commissioned(event: any) {
    this.router.navigate([this.commonUrl + event]);
  }
  private modbusDevice(event: any) {
    this.router.navigate([this.commonUrl + event]);
  }
  private modbusAttribute(event: any) {
    this.router.navigate([this.commonUrl + event]);
  }

  private discovered(event: any) {
    this.router.navigate([this.commonUrl + event]);
  }

  getProfile(event: any) {
    this.profile(event);
  }

  getCommissioned(event: any) {
    this.commissioned(event);
  }

  getDiscovered(event: any) {
    this.discovered(event);
  }
  getDevice(event: any) {
    this.modbusDevice(event);
  }
  getAttribute(event: any) {
    this.modbusAttribute(event);
  }

  modbusConfig(event: any) {
    switch (event) {
      case this.Profile:
        this.getProfile(event);
        break;
      case this.Commissioned:
        this.getCommissioned(event);
        break;
      case this.Discovered:
        this.getDiscovered(event);
        break;
      case this.ModbusDevice:
        this.getDevice(event);
        break;
      case this.ModbusAttribute:
        this.getDevice(event);
        break;
    }
  }
}
