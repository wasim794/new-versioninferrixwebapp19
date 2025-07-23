export class MeshScratchpadStatusModel {
  address: number;
  nodeType: string;
  timestamp: number;
  data: MeshScratchpadStatusResponseData;

  constructor(model?: Partial<MeshScratchpadStatusModel>) {
    if (model) {
      Object.assign(this, model);
    }

    if(this.data) {
      this.data = new MeshScratchpadStatusResponseData(this.data);
    }
  }
}

export class MeshScratchpadStatusResponseData {
  storedScratchpadLength: number;
  storedScratchpadCrc: number;
  storedScratchpadSequenceNumber: number;
  storedScratchpadType: number;
  storedScratchpadStatus: number;
  processedScratchpadLength: number;
  processedScratchpadCrc: number;
  processedScratchpadSequenceNumber: number;
  processedFirmwareAreaId: string;
  firmwareVersion: string;
  applicationProcessedScratchPadLength: number;
  applicationProcessedScratchPadCrc: number;
  applicationProcessedScratchPadSequenceNumber: number;
  applicationProcessedApplicationAreaId: number;
  applicationVersion: string;
  action: string;
  targetSequence: number;
  targetCrc: number;
  processingDelay: number;
  remainingDelay: number;

  constructor(model?: Partial<MeshScratchpadStatusResponseData>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
