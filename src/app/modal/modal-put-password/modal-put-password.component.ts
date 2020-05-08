import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

interface ChangePassword {
  currentPasswd: String;
  newPasswd: String;
  confirmPasswd: String;
}

@Component({
  selector: 'app-modal-put-password',
  templateUrl: './modal-put-password.component.html',
  styleUrls: ['./modal-put-password.component.css']
})
export class ModalPutPasswordComponent implements OnInit {

  private passwdForm: FormGroup;

  private passwd: ChangePassword = {
    currentPasswd: '',
    newPasswd: '',
    confirmPasswd: ''
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ModalPutPasswordComponent>
  ) { }

  ngOnInit(): void {
    this.passwdForm = this.formBuilder.group({
      currentPasswd: [this.passwd.currentPasswd],
      newPasswd: [this.passwd.newPasswd],
      confirmPasswd: [this.passwd.confirmPasswd]
    })
  }

  async onSubmit() {
    const passwdFormValue: ChangePassword = this.passwdForm.value;

    console.log(passwdFormValue);

    const user = await this.userService.getById(parseInt(sessionStorage.getItem('userId'))).toPromise();

    if (!passwdFormValue.currentPasswd)
      alert('Preencha a senha atual');

    else if (!passwdFormValue.newPasswd)
      alert('Preencha a nova senha');

    else if (!passwdFormValue.confirmPasswd)
      alert('Confirme a senha')

    else {
      this.authService.getToken({ username: user.username, password: passwdFormValue.currentPasswd })
        .subscribe(
          () => {
            if (passwdFormValue.newPasswd === passwdFormValue.confirmPasswd)
              this.putPasswd(user.id, passwdFormValue.confirmPasswd);

            else
              alert('As senhas não coincidem')
          },
          err => {
            if (err.status === 401)
              alert('Senha atual inválida')

            else
              console.log(err);
          }
        )
    }
  }

  putPasswd(id: Number, password: String) {
    this.userService.put(id, { password: password }).subscribe(
      () => {
        alert('Senha alterada');

        this.dialogRef.close();
      },
      err => {
        console.log(err);
      }
    );
  }

}
