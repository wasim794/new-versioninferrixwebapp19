import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderService} from './service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports : [

  ],
  providers: [
    HeaderService
  ],
  declarations: []
})
export class FrameModule { }
