import { AbstractEventDetectorModel } from "./abstractEventDetectorModel";

export class EventDetectorModel {
  id!: string;
  action!: string;
  body: any;
  requests: any = [];
  timeout!: number;
  expiration!: number;
}
