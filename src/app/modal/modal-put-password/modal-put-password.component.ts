import { GlobalFunctions } from './../../global';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private dialogRef: MatDialogRef<ModalPutPasswordComponent>,
    private snackBar: MatSnackBar,
    private globalFunc: GlobalFunctions
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

    const user = await this.userService.getById(parseInt(sessionStorage.getItem('userId'))).toPromise();

    if (!passwdFormValue.currentPasswd)
      this.snackBar.open('Preencha a senha atual', 'Fechar', { duration: 2000 })

    else if (!passwdFormValue.newPasswd)
      this.snackBar.open('Preencha a nova senha', 'Fechar', { duration: 2000 })

    else if (!passwdFormValue.confirmPasswd)
      this.snackBar.open('Confirme a senha', 'Fechar', { duration: 2000 })

    else {
      this.authService.getToken({ username: user.username, password: passwdFormValue.currentPasswd })
        .subscribe(
          () => {
            if (passwdFormValue.newPasswd === passwdFormValue.confirmPasswd)
              this.putPasswd(user.id, passwdFormValue.confirmPasswd);

            else
              this.snackBar.open('As senhas não coincidem', 'Fechar', { duration: 2000 })
          },
          err => {
            if (err.status === 401)
              this.snackBar.open('Senha atual inválida', 'Fechar', { duration: 2000 })

            else {
              this.globalFunc.showNotification("Ocorreu um erro durante a alteração", 1)

              console.log(err);
            }
          }
        )
    }
  }

  putPasswd(id: Number, password: String) {
    this.userService.put(id, { password: password }).subscribe(
      () => {
        this.globalFunc.showNotification("Senha alterada com sucesso!", 1)

        this.dialogRef.close();
      },
      err => {
        this.globalFunc.showNotification("Ocorreu um erro durante a alteração", 1)

        console.log(err);
      }
    );
  }

}
