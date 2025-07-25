import {EventModel} from "./event.model";

export class DiagnosticEventModel {
  event1: EventModel;
  event2: EventModel;
  event3: EventModel;
  event4: EventModel;
  event5: EventModel;
  event6: EventModel;
  event7: EventModel;
  event8: EventModel;
  event9: EventModel;
  event10: EventModel;
  event11: EventModel;
  event12: EventModel;
  event13: EventModel;
  event14: EventModel;
  event15: EventModel;

  constructor(model?: Partial<DiagnosticEventModel>) {
    if (model) {
      Object.assign(this, model);
    }

    if (model?.event1) {
      this.event1 = new EventModel(model.event1);
    } else {
      this.event1 = new EventModel();
    }

  if (model?.event2) {
      this.event2 = new EventModel(model.event2);
    } else {
      this.event2 = new EventModel();
    }

    if (model?.event3) {
      this.event3 = new EventModel(model.event3);
    } else {
      this.event3 = new EventModel();
    }

   if (model?.event4) {
      this.event4 = new EventModel(model.event4);
    } else {
      this.event4 = new EventModel();
    }

   if (model?.event5) {
      this.event5 = new EventModel(model.event5);
    } else {
      this.event5 = new EventModel();
    }

    if (model?.event6) {
      this.event6 = new EventModel(model.event6);
    } else {
      this.event6 = new EventModel();
    }

   if (model?.event7) {
      this.event7 = new EventModel(model.event7);
    } else {
      this.event7 = new EventModel();
    }

    if (model?.event8) {
      this.event8 = new EventModel(model.event8);
    } else {
      this.event8 = new EventModel();
    }

   if (model?.event9) {
      this.event9 = new EventModel(model.event9);
    } else {
      this.event9 = new EventModel();
    }

   if (model?.event10) {
      this.event10 = new EventModel(model.event10);
    } else {
      this.event10 = new EventModel();
    }

    if (model?.event11) {
      this.event11 = new EventModel(model.event11);
    } else {
      this.event11 = new EventModel();
    }

   if (model?.event12) {
      this.event12 = new EventModel(model.event12);
    } else {
      this.event12 = new EventModel();
    }

   if (model?.event13) {
      this.event13 = new EventModel(model.event13);
    } else {
      this.event13 = new EventModel();
    }

    if (model?.event14) {
      this.event14 = new EventModel(model.event14);
    } else {
      this.event14 = new EventModel();
    }

   if (model?.event15) {
      this.event15 = new EventModel(model.event15);
    } else {
      this.event15 = new EventModel();
    }
  }
}
