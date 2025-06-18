import {Component, Input, OnInit} from '@angular/core';
import {NoneTextRendererModel, TimeTextRendererModel, RangeTextRendererModel, MultistateTextRendererModel,
  AnalogTextRendererModel, BaseTextRendererModel, BinaryTextRendererModel, PlainTextRendererModel} from '../text-renderer';
import {DataPointModel} from '../../../../model';
import {commonHelp} from '../../../../../help/commonHelp';
import {HelpModalComponent} from '../../../../../help/help-modal/help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {DictionaryService} from "../../../../../core/services";
import {newTypes} from "../../../../../common";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  selector: 'app-text-renderer',
  templateUrl: './text-renderer.component.html',
  styleUrls: []
})
export class TextRendererComponent implements OnInit {
  @Input() dataPoint!: DataPointModel;

  types = newTypes;

  textRenderer = new BaseTextRendererModel('');
  analogTextRenderer = new AnalogTextRendererModel('textRendererAnalog');
  binaryTextRenderer = new BinaryTextRendererModel('textRendererBinary');
  multistateTextRenderer = new MultistateTextRendererModel('textRendererMultistate');
  plianTextRenderer = new PlainTextRendererModel('textRendererPlain');
  rangeTextRenderer = new RangeTextRendererModel('textRendererRange');
  timeTextRenderer = new TimeTextRendererModel('textRendererTime');
  noneTextRenderer = new NoneTextRendererModel('textRendererNone');
  incrementVal!: number;
  incrementFrom!: number;
  incrementTo!: number;
  selectedValue!: string;
  public multistateColor!: string;
  public rangeColour!: string;
  showZero = false;
  showOne = false;
  info = new commonHelp();
  title = 'Text Renderers';
  numberFormat_title = 'Number Formats';
  dateFormat_title = 'Date/Time Formats';
  classToggled = false;
  UIDICTIONARY : any;

  constructor(private dialog: MatDialog, public dictionaryService: DictionaryService) {
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
        });
    this.setTextRender();
  }

  textRendererType(val: string) {
    this.selectedValue = val;
  }

  setTextRender() {
    this.textRenderer.type = this.dataPoint.textRenderer.type;
    switch (this.dataPoint.textRenderer.type) {
      case 'textRendererAnalog' :
        this.analogTextRenderer = this.dataPoint.textRenderer;
        break;
      case 'textRendererBinary' :
        this.binaryTextRenderer = this.dataPoint.textRenderer;
        break;
      case 'textRendererMultistate' :
        this.multistateTextRenderer = this.dataPoint.textRenderer;
        break;
      case 'textRendererPlain' :
        this.plianTextRenderer = this.dataPoint.textRenderer;
        break;
      case 'textRendererRange' :
        this.rangeTextRenderer = this.dataPoint.textRenderer;
        break;
      case 'textRendererTime' :
        this.timeTextRenderer = this.dataPoint.textRenderer;
        break;
      case 'textRendererNone' :
        this.noneTextRenderer = this.dataPoint.textRenderer;
        break;
    }
    this.textRendererType(this.textRenderer.type);
  }

  addTextRenderProperties() {
    switch (this.textRenderer.type) {
      case 'textRendererAnalog' :
        return this.analogTextRenderer;
      case 'textRendererBinary' :
        return this.binaryTextRenderer;
      case 'textRendererMultistate' :
        return this.multistateTextRenderer;
      case 'textRendererPlain' :
        return this.plianTextRenderer;
      case 'textRendererRange' :
        return this.rangeTextRenderer;
      case 'textRendererTime' :
        return this.timeTextRenderer;
      case 'textRendererNone' :
        return this.noneTextRenderer;
    }
  }

  public setZeroColor(color: string) {
    this.binaryTextRenderer.zeroColour = color;
    this.showZero = false;
  }

  public setOneColor(color: string) {
    this.binaryTextRenderer.oneColour = color;
    this.showOne = false;
  }

  public setRangeColor(color: string) {
    this.rangeColour = color;
    this.showOne = false;
  }

  public setMultistateColor(color: string) {
    this.multistateColor = color;
    this.showOne = false;
  }

  getZeroColor() {
    this.classToggled = !this.classToggled;
    this.showZero = true;
  }

  getOneColor() {
    this.classToggled = !this.classToggled;
    this.showOne = true;
  }

  addMultistateValue(key: string, text: any) {
    this.classToggled = !this.classToggled;
    const theKey = parseInt(key);
    if (isNaN(theKey)) {
      alert('Enter a number');
      //return false;
    }
    for (let i = this.multistateTextRenderer.multistateValues.length - 1; i >= 0; i--) {
      if (this.multistateTextRenderer.multistateValues[i].key === key) {
        alert('List already contains the key');
        //return false;
      }
    }
    const colour = this.multistateColor;
    const multistateValues = {key: key, text: text, colour: colour};
    this.multistateTextRenderer.multistateValues[this.multistateTextRenderer.multistateValues.length] = multistateValues;
    this.incrementVal = theKey + 1;
  }

  removeMultistateValue(val: any) {
    this.multistateTextRenderer.multistateValues.forEach((item, index) => {
      if (item.key === val) {
        this.multistateTextRenderer.multistateValues.splice(index, 1);
      }
    });
  }

  addRangeValue(from: string, to: string, text: any) {
    const theFrom = parseFloat(from);
    if (isNaN(theFrom)) {
      alert('Enter a valid number');

    }
    const theTo = parseFloat(to);
    if (isNaN(theTo)) {
      alert('Enter a valid number');

    }
    if (theFrom >= theTo) {
      alert('From value must be less than the To value');

    }

    for (let i = 0; i < this.rangeTextRenderer.rangeValues.length; i++) {
      if (this.rangeTextRenderer.rangeValues[i].from === theFrom && this.rangeTextRenderer.rangeValues[i].to === theTo) {
        alert('List already contains the same range' + theFrom + ' - ' + theTo);

      }
    }

    const diff = theTo - theFrom;
    const colour = this.rangeColour;
    const rangeValues = {from: from, to: to, text: text, colour: colour};
    this.rangeTextRenderer.rangeValues[this.rangeTextRenderer.rangeValues.length] = rangeValues;
    this.incrementFrom = theTo;
    this.incrementTo = theTo + (theTo - theFrom);

    this.rangeTextRenderer.rangeValues.sort(function (a: { from: number; to: number; }, b: { from: number; to: number; }) {
      if (a.from === b.from) {
        return a.to - b.to;
      }
      return a.from - b.from;
    });
  }

  removeRangeValue(from: any, to: any) {
    for (let i = this.rangeTextRenderer.rangeValues.length - 1; i >= 0; i--) {
      if (this.rangeTextRenderer.rangeValues[i].from === from && this.rangeTextRenderer.rangeValues[i].to === to) {
        this.rangeTextRenderer.rangeValues.splice(i, 1);
      }
    }
  }

  numberFormatInfo() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'number Format_title', content: this.info.HtmlNumberFormatHelp},
      disableClose: true
    });
  }

  dateTimeFormatInfo() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'dateFormat_title', content: this.info.HtmlDatetimeFormatHelp},
      disableClose: true
    });
  }

  textRendererInfo() {
    this.dialog.open(HelpModalComponent, {

      data: {title: 'Text Renderer Help', content: this.info.HtmlTextRenderers},
      disableClose: true
    });
  }

}
