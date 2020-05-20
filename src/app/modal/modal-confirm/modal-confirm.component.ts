import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

interface ModalConfig {
  title: String;
  subtitle?: String;
}

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ModalConfig,
    private dialogRef: MatDialogRef<ModalConfirmComponent>
  ) { }

  close(confirm: boolean) {
    this.dialogRef.close(confirm);
  }

}
