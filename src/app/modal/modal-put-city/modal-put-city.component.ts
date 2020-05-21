import { GlobalFunctions } from './../../global';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CityService } from './../../services/city.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { City } from './../../models/City';
import { Component, OnInit, Inject } from '@angular/core';

interface StoreCity {
  name?: String,
  active?: Boolean
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
    private functions: GlobalFunctions
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

  async postCity() {
    if (!this.city.name.trim())
      this.snackBar.open('Preencha o nome da cidade', 'Fechar', { duration: 2000 });

    else {
      const close: boolean = await this.functions.confirm("Confirmar criação da cidade?", {
        width: "350px"
      })

      if (close === true)
        this.cityService.post(this.city).subscribe(
          () => {
            this.functions.showNotification("Cidade criada com sucesso!", 1)

            this.dialogRef.close();
          },
          err => {
            this.functions.showNotification("Ocorreu um erro durante a criação", 3)

            console.log(err);
          }
        )
    }
  }

  async putCity() {
    const citySubmit: StoreCity = {};

    if (this.city.name.trim() != this.data.name)
      citySubmit.name = this.city.name.trim();

    if (this.city.active != Boolean(this.data.active))
      citySubmit.active = this.city.active;

    if (JSON.stringify(citySubmit) != '{}') {
      const close: boolean = await this.functions.confirm("Confirmar alteração da cidade?", {
        width: "350px"
      })

      if (close === true)
        this.cityService.put(this.data.id, citySubmit).subscribe(
          () => {
            this.functions.showNotification("Cidade alterada com sucesso!", 1)

            this.dialogRef.close();
          },
          err => {
            this.functions.showNotification("Ocorreu um erro durante a alteração", 3)

            console.log(err)
          }
        )
    }
    else
      this.snackBar.open('Nenhuma alteração realizada', 'Fechar', { duration: 2000 })
  }
}
