export  class IntrinsicAlarmModel {
  public timeDelay!: number;
  public notificationClass!: number;
  public eventEnable: EventTransitionBitsModel = new EventTransitionBitsModel();
  public notifyType!: string;
  public timeDelayNormal!: number;

  constructor(model?: Partial<IntrinsicAlarmModel>) {
    if (model) {
      Object.assign(this, model)
    }

    if (model?.eventEnable) {
      this.eventEnable = new EventTransitionBitsModel(model?.eventEnable);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}

export class EventTransitionBitsModel {
  public toOffnormal!: boolean;
  public toFault!: boolean;
  public toNormal!: boolean;

  constructor(model?: Partial<EventTransitionBitsModel>) {
    if (model) {
      Object.assign(this, model)
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
