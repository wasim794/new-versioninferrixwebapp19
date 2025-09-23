import { MeshNodesDatasourceModel } from "../../../../core/models/dataSource";

export class VirtualSwitchDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType = 'VIRTUAL_SWITCH.DS';
  public uid!: string;
  public grade!: number;
  public gradeType!: string;

  constructor(model?: Partial<VirtualSwitchDatasourceModel>) {
    super(model);
    Object.assign(this, model); // Ensures all properties are initialized from the partial if provided
  }

  public override toJson(): any {
    // Combine base and current class properties into a plain object
    return {
      ...super.toJson(), // If super.toJson() returns a plain object; otherwise, replace with {}
      modelType: this.modelType,
      uid: this.uid,
      grade: this.grade,
      gradeType: this.gradeType
    };
  }
}
