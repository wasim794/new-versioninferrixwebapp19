export class ScratchpadDetailsModel {
  fwAreaId!: string;
  appAreaId!: string;

  constructor(model?: Partial<ScratchpadDetailsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
