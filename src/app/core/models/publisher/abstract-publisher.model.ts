import { BasicModel } from '../basic.model';
import { EventTypeAlarmLevelModel } from '../dataSource'; // Assuming correct path
import { AbstractPublisherPointModel } from './abstract-publisher-point.model';
import { TimePeriodModel } from '../timePeriod'; // Assuming correct path

export class AbstractPublisherModel<T extends AbstractPublisherModel<T>> extends BasicModel<T> {
 
  public modelType!: string;
  public enabled!: boolean;
  public eventAlarmLevels?: EventTypeAlarmLevelModel[];
  public points!: AbstractPublisherPointModel<any>[]; // Use 'any' if the point's type isn't generic here
  public publishType!: string;
  public cacheWarningSize!: number;
  public cacheDiscardSize!: number;
  public sendSnapshot!: boolean;
  public snapshotSendPeriod!: TimePeriodModel;

  constructor(model?: Partial<T>) {
    super(model); // Call the base class constructor first

    this.modelType = model?.modelType ?? ''; // Default to empty string if not provided
    this.enabled = model?.enabled ?? false; // Default to false
    this.publishType = model?.publishType ?? ''; // Default to empty string
    this.cacheWarningSize = model?.cacheWarningSize ?? 0; // Default to 0
    this.cacheDiscardSize = model?.cacheDiscardSize ?? 0; // Default to 0
    this.sendSnapshot = model?.sendSnapshot ?? false; // Default to false

    // Handle nested object instantiation defensively
    if (model?.eventAlarmLevels) {
      // Ensure 'eventAlarmLevels' is always an array
      this.eventAlarmLevels = model.eventAlarmLevels.map(
        (alarmLevel) => new EventTypeAlarmLevelModel(alarmLevel)
      );
    } else {
      this.eventAlarmLevels = []; // Initialize as an empty array if not provided
    }

    if (model?.points) {
      // Ensure 'points' is always an array
      this.points = model.points.map(
        (point) => point
      );
    } else {
      this.points = []; // Initialize as an empty array if not provided
    }

    if (model?.snapshotSendPeriod) {
      this.snapshotSendPeriod = new TimePeriodModel(model.snapshotSendPeriod);
    } else {
   
      this.snapshotSendPeriod = new TimePeriodModel(); // Or new TimePeriodModel({}) if its constructor takes Partial
    }
  }

  public override toJson(): any {
    const json: any = super.toJson(); // Get the JSON representation from the base class


    json.modelType = this.modelType;
    json.enabled = this.enabled;

    // Use map only if the array exists; otherwise, it will be undefined or an empty array
    json.eventAlarmLevels = this.eventAlarmLevels?.map(alarmLevel => alarmLevel.toJson()) ?? [];
    json.points = this.points?.map(point => point.toJson()) ?? []; // Ensure points array is initialized

    json.publishType = this.publishType;
    json.cacheWarningSize = this.cacheWarningSize;
    json.cacheDiscardSize = this.cacheDiscardSize;
    json.sendSnapshot = this.sendSnapshot;

    // Ensure snapshotSendPeriod exists before calling toJson()
    json.snapshotSendPeriod = this.snapshotSendPeriod?.toJson(); // Add optional chaining here too

    return json;
  }
}