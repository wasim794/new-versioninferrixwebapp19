export interface EmailConfigurationModel {
  emailSmtpHost: number;
  emailSmtpPort: number;
  emailFromAddress: string;
  emailFromName: string;
  emailAuthorization: boolean;
  emailSendTimeout: boolean;
  emailDisabled: boolean;
  emailSmtpUsername: string;
  emailSmtpPassword: string;
  emailContentType: number;
  emailTls: boolean;

}
