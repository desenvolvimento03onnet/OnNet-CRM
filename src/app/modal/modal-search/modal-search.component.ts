import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapsComponent } from 'app/maps/maps.component';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.css']
})
export class ModalSearchComponent implements OnInit {

  constructor(
    private modal: MatDialog,
    private modalRef: MatDialogRef<ModalSearchComponent>, @Inject(MAT_DIALOG_DATA) public data: MapsComponent
  ) { 
    console.log(data)
  }

  ngOnInit(): void {
  }

}
