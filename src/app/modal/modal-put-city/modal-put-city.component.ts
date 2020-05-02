import { CityService } from './../../services/city.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { City } from './../../models/City';
import { Component, OnInit, Inject } from '@angular/core';

interface StoreCity {
  name: String,
  active: Boolean
}

@Component({
  selector: 'app-modal-put-city',
  templateUrl: './modal-put-city.component.html',
  styleUrls: ['./modal-put-city.component.css']
})
export class ModalPutCityComponent implements OnInit {

  private city: StoreCity;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: City,
    private dialogRef: MatDialogRef<ModalPutCityComponent>,
    private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.refreshCity();
  }

  refreshCity() {
    if (this.data) {
      this.city = {
        name: this.data.name,
        active: Boolean(this.data.active)
      }
    }
    else {
      this.city = {
        name: "",
        active: true
      }
    }
  }

  changeActive(checked: Boolean) {
    this.city.active = checked;
  }

  onSubmit() {
    if (this.data)
      this.putCity();

    else
      this.postCity();
  }

  postCity() {
    if (!this.city.name.trim())
      alert("Preencha o nome da cidade");
    else
      this.cityService.post(this.city).subscribe(
        () => {
          this.dialogRef.close();
        },
        err => {
          console.log(err);
          this.dialogRef.close();
        }
      )
  }

  putCity() {
    const citySubmit = this.city;

    if (this.city.name.trim() == this.data.name)
      delete citySubmit.name;

    if (this.city.active == Boolean(this.data.active))
      delete citySubmit.active

    if (JSON.stringify(citySubmit) != '{}') {
      this.cityService.put(this.data.id, citySubmit).subscribe(
        () => {
          this.dialogRef.close();
        },
        err => {
          console.log(err)
          this.dialogRef.close();
        }
      )
    }
    else {
      alert("Nenhuma alteração realizada");
      this.dialogRef.close();
    }
  }
}
