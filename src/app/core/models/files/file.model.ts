export class FileModel {
  folderPath!: string;
  filename!: string;
  relativePath!: string;
  fileStoreXid!: string;
  mimeType!: string;
  lastModified!: Date;
  size!: number;
  directory!: boolean;

  constructor(model?: Partial<FileModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
