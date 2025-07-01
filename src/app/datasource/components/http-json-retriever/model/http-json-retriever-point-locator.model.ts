import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class HttpJsonRetrieverPointLocatorModel extends PointLocatorModel<HttpJsonRetrieverPointLocatorModel> {
  public modelType = 'HTTP_JSON_RETRIEVER.PL';
  public valuePointer!: string;
  public ignoreIfMissing!: boolean;
  public valueFormat!: string;
  public timePointer!: string;
  public timeFormat!: string;
  public setPointName!: string;

  constructor(model?: Partial<HttpJsonRetrieverPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
