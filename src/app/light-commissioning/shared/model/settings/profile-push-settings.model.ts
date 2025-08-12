import {DeviceStats} from '../stats/profilepush-node-stats.model';
export class ProfilePushSettingsModel {
  public lightCommissioningProfilePushScheduleHour: number;
  public lightCommissioningProfilePushScheduleMin: number;
  public lightCommissioningProfilePushScheduleSec: number;
  public lightCommissioningProfilePushScheduleAfterExecute: number;
  public lightCommissioningProfilePushEnabled: boolean;
  public lightCommissioningProfilePushScheduleSleepTimeFirstRun: number;
  public lightCommissioningProfilePushScheduleSleepTimeRetryRun: number;
  public lightCommissioningProfilePushHoldTime: number;
  public lightCommissioningProfilePushNodesFilter: number;
  public lightCommissioningProfilePushToDownNodes: boolean;
  public lightCommissioningProfilePushScheduleRuntimeStats:DeviceStats;

  constructor(model?: Partial<ProfilePushSettingsModel>) {
    if (model) {
      Object.assign(this, model);
    }
    else{
      this.lightCommissioningProfilePushScheduleRuntimeStats = this.getStatus();
    }
  }

  public getStatus(): DeviceStats {
    return {
      commissioned: 0,
      discovered: 0,
      up: 0,
      down: 0,
      normal: 0,
      enocean: 0,
      sink: 0,
      ledController: 0,
      relayController: 0,
      diController: 0,
      mokoBand: 0,
      total: 0,
      autoModeEnable: 0,
      autoModeDisable: 0
    };
  }

}


