import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatModuleModule} from '../../common/mat-module';

export interface DialogData {
  content: string;
  title: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: []
})
export class HelpModalComponent {

  constructor(public dialogRef: MatDialogRef<HelpModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

}
