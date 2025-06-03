import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DictionaryService } from "../../core/services/dictionary.service";
import { MatModuleModule } from '../../common/mat-module';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog'; // Import dialog elements

export interface DialogData {
  message: string;
  name: string;
}

@Component({
  standalone: true,
  imports: [
    MatModuleModule,
    MatButtonModule, // Add MatButtonModule to imports
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  providers: [DictionaryService],
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: []
})
export class ConfirmDialogComponent implements OnInit {
  UIDICTIONARY: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dictionaryService: DictionaryService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data => {
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
  }

  closeDialog(result: boolean = false) {
    this.dialogRef.close(result);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}