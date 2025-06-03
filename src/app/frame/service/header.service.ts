import {Injectable, EventEmitter} from '@angular/core';
import {Subject, Observable} from 'rxjs';
/**
 The grid is primarily controlled by MenuService Events. You can change the behavior by
 changing the MenuComponent and have it call methods within the Grid component via Output Events
 within the Menu component or by using the @ViewChild approach.

 In the current code, the MenuService is shared by the GridComponent and MenuComponent.
 The MenuComponent relays events from the various components that make up the MenuComponent.
 The GridComponent listens for those events via an Observable. The GridComponent will also
 raise/emit an event that will be picked up by the MenuComponent via the MenuService through an Observable as well.
 */
 interface IEvent {
  name: string;
  data: any;
}

@Injectable()
export class HeaderService {
  displayButton = new EventEmitter();
  button: boolean = false;
  private menuSubject: Subject<IEvent> = new Subject<IEvent>();
  // private gridSubject: Subject<IEvent> = new Subject<IEvent>();
  // private subscribers: Array<Subject<string>> = [];
  // dashBoardLayout = new EventEmitter();

  constructor() {
  }

  raiseMenuEvent(event: IEvent) {
    this.menuSubject.next(event);
  }

}
