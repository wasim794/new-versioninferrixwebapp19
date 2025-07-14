import {AbstractEventHandlerModel} from '../../../core/models/events/handlers';

export interface OnEditInit {
  eventHandlerEditInit(handler: AbstractEventHandlerModel<any>): void;
}

export interface OnAddInit {
  eventHandlerAddInit(type: string): void;
}

export interface OnEventHandlerSave {
  eventHandlerSave(): void;
}

export interface OnEventHandlerUpdate {
  eventHandlerUpdate(): void;
}
