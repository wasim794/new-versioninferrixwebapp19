import {BasicModel} from '../basic.model';
import {TimePeriodModel} from '../timePeriod';
import {
  AnalogTextRendererModel,
  BaseTextRendererModel,
  BinaryTextRendererModel,
  MultistateTextRendererModel,
  NoneTextRendererModel,
  PlainTextRendererModel,
  RangeTextRendererModel,
  TimeTextRendererModel
} from './textRenderer';
import {LoggingPropertiesModel} from './logging-properties.model';
import {PointLocatorModel} from './point-locator.model';

export class DataPointModel extends BasicModel<DataPointModel> {
  public enabled!: boolean;
  public deviceName!: string;
  public purgeOverride!: boolean;
  public purgePeriod!: TimePeriodModel;
  public textRenderer!: BaseTextRendererModel<any>;
  public loggingPropertiesModel!: LoggingPropertiesModel;
  public readPermission!: string;
  public setPermission!: string;
  public settable!: boolean;
  public pointLocator!: PointLocatorModel<any>;
  public dataSourceId!: number;
  public dataSourceXid!: string;
  public dataSourceName!: string;
  public extendedName!: string;


  constructor(model?: Partial<DataPointModel>) {
    super(model);

     if (model?.purgePeriod) {
      this.purgePeriod = new TimePeriodModel(model.purgePeriod);
    } else {
      // Provide a default if purgePeriod is not provided in the model
      this.purgePeriod = new TimePeriodModel(); // Or handle as appropriate for your application
    }

    if (this.textRenderer) {
      switch (model?.textRenderer?.type) {
        case 'textRendererAnalog':
          this.textRenderer = new AnalogTextRendererModel(model?.textRenderer);
          break;
        case 'textRendererBinary':
          this.textRenderer = new BinaryTextRendererModel(model?.textRenderer);
          break;
        case 'textRendererMultistate':
          this.textRenderer = new MultistateTextRendererModel(model?.textRenderer);
          break;
        case 'textRendererNone':
          this.textRenderer = new NoneTextRendererModel(model?.textRenderer);
          break;
        case 'textRendererPlain':
          this.textRenderer = new PlainTextRendererModel(model?.textRenderer);
          break;
        case 'textRendererRange':
          this.textRenderer = new RangeTextRendererModel(model?.textRenderer);
          break;
        case 'textRendererTime':
          this.textRenderer = new TimeTextRendererModel(model?.textRenderer);
          break;
        default:
          break;
      }
    }

    if (model?.loggingPropertiesModel) {
      this.loggingPropertiesModel = new LoggingPropertiesModel(model.loggingPropertiesModel);
    } else {
      // Provide a default if loggingPropertiesModel is not provided in the model
      this.loggingPropertiesModel = new LoggingPropertiesModel(); // Or handle as appropriate for your application
    }

   if (this.pointLocator) {
      // @ts-ignore
      this.pointLocator = new PointLocatorModel<any>(model.pointLocator);
    }

  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
