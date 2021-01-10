import { ToastrService } from 'ngx-toastr';
import { LoginService } from './../login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService, StartupService, TokenService } from '@core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private token: TokenService,
    private startup: StartupService,
    private settings: SettingsService,
    private toastr:ToastrService,
    private loginSvc: LoginService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    if(this.loginForm.invalid){
      this.toastr.warning('Fill all required details','Validation',{timeOut:3000})
      return;
    }

    this.loginSvc.validateLogin(this.username.value,this.password.value)
    // .subscribe(res => {
    //   console.log(res)
    // })
    .toPromise()
    .then(res => {
      const { token, uid, username } = { token: res.password, uid:res._id, username:res.first_name };
      // Set user info
      this.settings.setUser({
        id: uid,
        name: username,
        email: res.email,
        avatar: './assets/images/user.jpg',
      });
      // Set token info
      this.token.set({ token, uid, username });
      // Regain the initial data
      this.startup.load().then(() => {
        let url = this.token.referrer!.url || '/';
        if (url.includes('/auth')) {
          url = '/';
        }
        this.router.navigateByUrl(url);
      });
    }).catch(err => {
      console.error(err)
    })
  }
}
