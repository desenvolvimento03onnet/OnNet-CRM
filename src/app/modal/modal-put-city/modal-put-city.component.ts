import { GlobalFunctions } from './../../global';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private cityService: CityService,
    private snackBar: MatSnackBar,
    private globalFunc: GlobalFunctions
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
      this.snackBar.open('Preencha o nome da cidade', 'Fechar');
    else
      this.cityService.post(this.city).subscribe(
        () => {
          this.globalFunc.showNotification("Cidade criada com sucesso!", 1)

          this.dialogRef.close();
        },
        err => {
          this.globalFunc.showNotification("Ocorreu um erro durante a criação", 3)

          console.log(err);
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
          this.globalFunc.showNotification("Cidade alterada com sucesso!", 1)

          this.dialogRef.close();
        },
        err => {
          this.globalFunc.showNotification("Ocorreu um erro durante a alteração", 3)

          console.log(err)
        }
      )
    }
    else
      this.snackBar.open('Nenhuma alteração realizada', 'Fechar', { duration: 1000 })
  }
}
