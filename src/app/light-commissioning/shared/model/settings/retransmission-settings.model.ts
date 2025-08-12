export interface RetransmissionSettingsModel {
  settingsType: 'RETRANSMISSION_SETTINGS';
  pirRetransmissionCount: number;
  pirRetransmissionDelayInterval: number;
  luxRetransmissionCount: number;
  luxRetransmissionDelayInterval: number;
  switchRetransmissionCount: number;
  switchRetransmissionDelayInterval: number;
}
