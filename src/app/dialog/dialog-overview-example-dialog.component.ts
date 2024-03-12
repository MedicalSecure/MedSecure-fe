import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessageComponent } from "../message/message.component";
export interface DialogData {
  animal: string;
  name: string;
}
@Component({
    selector: 'app-dialog-overview-example-dialog',
    standalone: true,
    templateUrl: './dialog-overview-example-dialog.component.html',
    styleUrl: './dialog-overview-example-dialog.component.css',
    imports: [MatButtonModule, MessageComponent,FormsModule, MatFormFieldModule, MatInputModule, MatDialogClose, MatDialogActions, MatDialogContent, MatDialogTitle, MessageComponent]
})
export class DialogOverviewExampleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

