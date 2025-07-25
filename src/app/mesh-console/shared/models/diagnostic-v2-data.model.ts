import {BufferUsageModel} from "./buffer-usage.model";
import {CbmacDetailsModel} from "./cbmac-details.model";
import {NextHopDetailsModel} from "./next-hop-details.model";
import {DiagnosticEventModel} from "./diagnostic-event.model";
import {TraceOptionModel} from "./trace-option.model";
import {InstallationQualityModel} from "./installation-quality.model";
import {NeighborDeviceInfoModel} from "./neighbor-device-info.model";
import {FtdmaTableModel} from "./ftdma-table.model";

export class DiagnosticV2DataModel {
  role!: string;
  voltage!: number;
  bufferUsage!: BufferUsageModel;
  memoryAllocationFailures!: number;
  packetsDropped!: number;
  cbmacDetails!: CbmacDetailsModel;
  cbmacBroadcastLlMembersPending!: number;
  cbmacBroadcastLeMembersPending!: number;
  cbmacBroadcastNextHopPending!: number;
  cbmacBroadcastUnackPending!: number;
  cbmacPacketsExpiredPending!: number;
  cbmacPacketsReroutePending!: number;
  cbmacUnicastClusterPending!: number;
  cbmacBlacklistingChannelsMinTo40!: number;
  nextHopDetails: NextHopDetailsModel;
  cfmacAccessCycleInterval!: number;
  cfmacPendingBroadcastLeMember!: number;
  cfmacMessagesAck!: number;
  cfmacAlohaUploadMaximum!: number;
  cfmacReservedUploadMaximum!: number;
  cfmacReservedUploadAverage!: number;
  scanStatAvgRouters!: number;
  networkScansAmount!: number;
  sleepTime!: number
  installationQuality: InstallationQualityModel;
  droppedUnackBcsPacket!: number;
  unackBroadCastChannel!: number;
  wbnRssiCorrectionVal!: number;
  networkChannelPer!: number;
  ccaLimitDbm!: number;
  addressClashes!: number;
  nborDeviceInfo!: NeighborDeviceInfoModel;
  clusterChannel!: number;
  clusterChannelReliability!: number;
  events: DiagnosticEventModel;
  blacklistedChannelAmount!: number;
  traceOptions: TraceOptionModel;
  cbmacUnicastMembersPending!: number;
  cbmacBlacklistingChannels41ToMax!: number;
  llDeviceCountInRadioRange!: number;
  clusterMemberAmount!: number;
  clusterRouterAmount!: number;
  scanTotalTime!: number;
  bleScannerActive!: number;
  costCompThroughput!: number;
  costCompBadLink!: number;
  costCompBadChannel!: number;
  costCompAssociation!: number;
  costCompBuffer!: number;
  costCompEnergy!: number;
  joiningBeaconActive!: number;
  floodingPacketsAmount!: number;
  ftdmaTable: FtdmaTableModel;
  droppedReassemblyPacket!: number;

  constructor(model?: Partial<DiagnosticV2DataModel>) {
    if (model) {
      Object.assign(this, model);
    }

    if (model?.bufferUsage) {
      this.bufferUsage = new BufferUsageModel(model.bufferUsage);
    } else {
      this.bufferUsage = new BufferUsageModel();
    }

    if (model?.cbmacDetails) {
      this.cbmacDetails = new CbmacDetailsModel(model.cbmacDetails);
    } else {
      this.cbmacDetails = new CbmacDetailsModel();
    }

    if (model?.nextHopDetails) {
      this.nextHopDetails = new NextHopDetailsModel(model.nextHopDetails);
    } else {
      this.nextHopDetails = new NextHopDetailsModel();
    }

    if (model?.installationQuality) {
      this.installationQuality = new InstallationQualityModel(model.installationQuality);
    } else {
      this.installationQuality = new InstallationQualityModel();
    }

    if (model?.nborDeviceInfo) {
      this.nborDeviceInfo = new NeighborDeviceInfoModel(model.nborDeviceInfo);
    } else {
      this.nborDeviceInfo = new NeighborDeviceInfoModel();
    }

    if (model?.events) {
      this.events = new DiagnosticEventModel(model.events);
    } else {
      this.events = new DiagnosticEventModel();
    }

    if (model?.traceOptions) {
      this.traceOptions = new TraceOptionModel(model.traceOptions);
    } else {
      this.traceOptions = new TraceOptionModel();
    }

    if (model?.ftdmaTable) {
      this.ftdmaTable = new FtdmaTableModel(model.ftdmaTable);
    } else {
      this.ftdmaTable = new FtdmaTableModel();
    }
  }
}
