export interface DatabaseActionsModel {
  action: string;
  backupFileName: string;
  restoreFileName: string;
  expiration: number;
  timeout: number;
}

