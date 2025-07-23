export class InstallationQualityModel {
  qualityIndicator: string;
  errorBitmap: string;

  constructor(model?: Partial<InstallationQualityModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
