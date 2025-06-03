import {Injectable} from '@angular/core';

import {Logger} from './logger.service';
import {EnvService} from '../core/services/env.service';

const noop = (): any => undefined;

@Injectable()
export class ConsoleLoggerService implements Logger {

  constructor(private env: EnvService) {
  }

  get info() {
    if (this.env.enableDebug) {
      // tslint:disable-next-line:no-console
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (this.env.enableDebug) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (this.env.enableDebug) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  // invokeConsoleMethod(type: string, args?: any): void {
  //   const logFn: Function = (console)[type] || console.log || noop;
  //   logFn.apply(console, [args]);
  // }
}
