import { GlobalFunctions } from './../../global';
import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Renderer2 } from '@angular/core';

interface Login {
  username: String;
  password: String;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private passwordVisible: Boolean = false;
  private typeInput: String = "password"
  private rememberPasswd: Boolean = false;
  private invalidLogin: Boolean = false;
  private loading: Boolean = false;

  private loginForm: FormGroup;

  private login: Login = {
    username: '',
    password: ''
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private globalFunc: GlobalFunctions,
    private renderer: Renderer2
  ) {
    const usrnm = localStorage.getItem('username');

    this.login.username = usrnm ? usrnm : '';
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [this.login.username],
      password: [this.login.password],
    })

    if (localStorage.getItem('username'))
      this.rememberPasswd = true;

    sessionStorage.clear();
  }

  onChange(event) {
    if (!event.target.checked)
      localStorage.removeItem('username')
  }

  showPassword() {
    this.passwordVisible = !this.passwordVisible;

    if (this.passwordVisible)
      this.typeInput = "text";

    else
      this.typeInput = "password";
  }

  onSubmit() {
    const loginFormValue = this.loginForm.value;
    const rememberLogin: any = document.getElementById('remember')

    this.loading = true;

    this.authService.getToken(loginFormValue).subscribe(
      async suc => {

        this.displayLoginError(false)

        sessionStorage.setItem('bearerToken', suc.token.toString());

        const user = await this.userService.get('username=' + loginFormValue.username).toPromise();

        sessionStorage.setItem('userId', user[0].id.toString());

        if (user[0].permission_id < 2)
          sessionStorage.setItem('isMaster', '1');

        if (rememberLogin.checked)
          localStorage.setItem('username', loginFormValue.username)

        this.router.navigateByUrl('/dashboard')
      },
      err => {
        if (err.status === 401)
          this.displayLoginError(true)
        else if (err.status === 500)
          this.globalFunc.showNotification("Ocorreu um erro interno. Erro: 500", 3)
        else
          this.globalFunc.showNotification("Não foi possível efetuar o login. Erro: " + err.status, 3)

        this.loading = false;

        console.log(err);
      }
    )
  }

  displayLoginError(display: boolean) {
    const loginErr = document.getElementById('invalidLoginForm');

    if (display) {
      this.renderer.setStyle(loginErr, "height", "35px");
      this.renderer.setStyle(loginErr, "transform", "scale(1)");
    }
    else {
      this.renderer.setStyle(loginErr, "transform", "scale(0)");
      this.renderer.setStyle(loginErr, "height", "0");
    }
  }
}
