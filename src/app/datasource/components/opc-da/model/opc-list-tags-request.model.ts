import {OpcListServersRequestModel} from "./opc-list-servers-request.model";

export class OpcListTagsRequestModel extends OpcListServersRequestModel {
  public server!: string;

  constructor(model?: Partial<OpcListTagsRequestModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
