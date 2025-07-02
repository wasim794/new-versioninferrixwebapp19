import {AbstractDatasourceModel} from '../../../../core/models/dataSource';


export class HttpReceiverModel extends AbstractDatasourceModel<HttpReceiverModel> {
  public override modelType? = 'HTTP_RECEIVER.DS';
  public ipWhiteList?: any[] = ['0.0.0.0.0']; // Default to universal IP range (more standard)
  public deviceIdWhiteList?: any[] = ['*'];

  constructor(model?: Partial<HttpReceiverModel>) {
    super(model);
     Object.assign(this, model);
    this.ipWhiteList = model?.ipWhiteList ?? this.ipWhiteList;
    this.deviceIdWhiteList = model?.deviceIdWhiteList ?? this.deviceIdWhiteList;
  }

  public override toJson(): any {
    return {
      ...super.toJson(),
      modelType: this.modelType,
      ipWhiteList: this.ipWhiteList,
      deviceIdWhiteList: this.deviceIdWhiteList,
    };
  }
}











// import {AbstractPollingDatasourceModel} from "../../../../core/models/dataSource/abstract-polling-datasource.model";
// export class HttpJsonRetrieverDatasourceModel extends AbstractPollingDatasourceModel<HttpJsonRetrieverDatasourceModel> {
//   public override modelType = 'HTTP_JSON_RETRIEVER.DS';
//   public url: string; // Use string instead of any
//   public timeoutSeconds: number = 30;
//   public retries: number = 2;
//   public setPointUrl: string; // Use string instead of any
//   public bearerAuth: boolean = false; // Provide default value
//   public bearerToken: string = ''; // Provide default value

//   constructor(model?: Partial<HttpJsonRetrieverDatasourceModel>) {
//     super(model);
//     this.url = model?.url || '';
//     this.setPointUrl = model?.setPointUrl || '';
//     this.bearerAuth = model?.bearerAuth ?? false;
//     this.bearerToken = model?.bearerToken ?? '';
//   }

//   public override toJson(): any {
//     return {
//       ...super.toJson(), // Include parent properties
//       modelType: this.modelType,
//       url: this.url,
//       timeoutSeconds: this.timeoutSeconds,
//       retries: this.retries,
//       setPointUrl: this.setPointUrl,
//       bearerAuth: this.bearerAuth,
//       bearerToken: this.bearerToken,
//     };
//   }
// }





